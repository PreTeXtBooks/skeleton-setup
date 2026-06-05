/* Toggle R code blocks on/off throughout the PreTeXt book.
 *
 * Adds a button to the PreTeXt navbar that shows or hides all
 * R code blocks (program elements with language="r") on the page.
 * The user's preference is persisted in localStorage so that it
 * carries across page navigation.
 */

(function () {
    "use strict";

    var STORAGE_KEY = "ptx-r-code-visible";
    var HIDDEN_CLASS = "r-code-hidden";

    function getRCodeBoxes() {
        var boxes = [];
        var allBoxes = document.querySelectorAll("div.code-box");
        for (var i = 0; i < allBoxes.length; i++) {
            if (allBoxes[i].querySelector("code.language-r")) {
                boxes.push(allBoxes[i]);
            }
        }
        return boxes;
    }

    function isVisible() {
        return localStorage.getItem(STORAGE_KEY) !== "false";
    }

    function applyVisibility(boxes, visible) {
        for (var i = 0; i < boxes.length; i++) {
            if (visible) {
                boxes[i].classList.remove(HIDDEN_CLASS);
            } else {
                boxes[i].classList.add(HIDDEN_CLASS);
            }
        }
    }

    function updateButton(button, visible) {
        var label = visible ? "Hide R Code" : "Show R Code";
        button.title = label;
        button.setAttribute("aria-label", label);
        button.querySelector(".name").textContent = label;
        button.setAttribute("aria-pressed", visible ? "true" : "false");
    }

    function addToggleButton(boxes) {
        var button = document.createElement("button");
        button.id = "r-code-toggle";
        button.className = "r-code-toggle button";

        var icon = document.createElement("span");
        icon.className = "r-code-toggle-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "{ }";

        var name = document.createElement("span");
        name.className = "name";

        button.appendChild(icon);
        button.appendChild(name);

        var visible = isVisible();
        updateButton(button, visible);
        applyVisibility(boxes, visible);

        button.addEventListener("click", function () {
            visible = !visible;
            localStorage.setItem(STORAGE_KEY, visible ? "true" : "false");
            applyVisibility(boxes, visible);
            updateButton(button, visible);
        });

        // Insert into the navbar's other-controls span, or create one
        var navControls = document.querySelector(".nav-other-controls");
        if (navControls) {
            navControls.insertBefore(button, navControls.firstChild);
        } else {
            var navbarContents = document.querySelector(".ptx-navbar-contents");
            if (navbarContents) {
                var span = document.createElement("span");
                span.className = "nav-other-controls";
                span.appendChild(button);
                navbarContents.appendChild(span);
            }
        }
    }

    function addStyle() {
        var style = document.createElement("style");
        style.textContent = [
            ".r-code-hidden { display: none !important; }",
            "#r-code-toggle .r-code-toggle-icon {",
            "    font-family: monospace;",
            "    font-size: 0.85em;",
            "    font-weight: bold;",
            "}"
        ].join("\n");
        document.head.appendChild(style);
    }

    document.addEventListener("DOMContentLoaded", function () {
        var boxes = getRCodeBoxes();
        if (boxes.length === 0) {
            return;
        }
        addStyle();
        addToggleButton(boxes);
    });
}());
