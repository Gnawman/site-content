function tocGen(depth=3) {
        // for this script to work, you must wrap everything you want to include in the table of contents with <div id="tocSource">
        // you must also include an empty <div id="toc">

        var tocSource = document.getElementById("tocSource").children;
        var hTracker = "";
        // tocDepth determines how deep into h[X] headings the script will go. Defaults to h1, h2, and h3, but can be changed for different deep
        var tocDepth = depth;

        // creates the table of contents div and sets style and properties
        var node = document.createElement("div");
        node.style.display = "inline-block";
        node.id = "toc";

        // loops through all children of the tocSource 
        for (let item of tocSource) {
                var itemTagName = item.tagName;
                // determines if the item is a heading, and whether it's shallow enough for our tocDepth
                if (itemTagName[0] == "H" && itemTagName[1] <= tocDepth) {
                        // I don't like the table of contents using text as big as the article itself, so this sizes it down
                        var entryTagName = "H"+(Number(itemTagName[1])+1);

                        // checks if the current entry has the same tag as the last one. This is to make grouped subsections look not bad
                        // on the first loop, this compares it to the empty string, so it's always going to fire
                        if (entryTagName != hTracker) {
                                // creates a new heading to append link/s to
                                var entry = document.createElement(entryTagName);
                                entry.style.textAlign = "left";
                                node.appendChild(entry);
                        }

                        // creates the link itself with properties from the original item
                        var link = document.createElement("a");
                        link.appendChild(document.createTextNode(item.textContent));
                        // points the link to the original item's ID. Anchor links are cool and best in game
                        link.href = "#"+item.id;

                        // appends children and adds a <br> so grouped subsections look not bad
                        entry.appendChild(link);
                        entry.appendChild(document.createElement("br"));

                        // sets the heading tracker for the next loop
                        hTracker = entryTagName;
                };    
        };
        // replaces the existing empty <div id="toc"> with the lovely table of contents we have just created
        document.getElementById('toc').replaceWith(node);
};
