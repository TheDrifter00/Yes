(function (GoNorth) {
    "use strict";
    (function (BindingHandlers) {

        if (typeof ko !== "undefined") {

            /// Scale Step
            var scaleStep = 0.1;

            /// Min Scale
            var minScale = 0.1;


            /**
             * Calculates the touch distance
             * @param {object[]} touches Touch objects
             * @returns {float} Touch distance
             */
            function calcTouchDistance(touches) {
                var distanceX = touches[0].screenX - touches[1].screenX;
                var distanceY = touches[0].screenY - touches[1].screenY;
                return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            }


            /**
             * Rounds a value to one digit
             * @param {float} value Value to round
             * @returns {float} Rounded Value
             */
            function roundToOneDigit(value) {
                return Math.round(value * 10) / 10;
            }

            /**
             * Updates the position and zoom display
             * @param {object} element Html which contains the display element
             * @param {object} paper JointJs paper
             */
            function updatePositionZoomDisplay(element, paper) {
                var scale = paper.scale().sx;
                var displayString = GoNorth.DefaultNodeShapes.Localization.NodeDisplay.Position + " " + roundToOneDigit(-paper.translate().tx) + "," + roundToOneDigit(-paper.translate().ty) + " ";
                displayString += GoNorth.DefaultNodeShapes.Localization.NodeDisplay.Zoom + " " + roundToOneDigit(scale);

                jQuery(element).find(".gn-nodeGraphPositionZoomIndicatorText").text(displayString);
            }

            /**
             * Updates the position and zoom in the url for the node graph
             * @param {object} paper JointJs paper
             */
            function updatePositionZoomUrl(paper) {
                var urlParams = "nodeX=" + roundToOneDigit(paper.translate().tx);
                urlParams += "&nodeY=" + roundToOneDigit(paper.translate().ty);
                urlParams += "&nodeZoom=" + roundToOneDigit(paper.scale().sx);

                var finalParams = window.location.search;
                if (finalParams) {
                    finalParams = finalParams.replace(/nodeX=.*?&nodeY=.*?&nodeZoom=.*?(&|$)/i, "");
                    if (finalParams[finalParams.length - 1] != "&") {
                        finalParams += "&";
                    }
                    finalParams += urlParams;
                }
                else {
                    finalParams = "?" + urlParams;
                }

                window.history.replaceState(finalParams, null, finalParams)
            }

            /**
             * Updates the mini map
             * 
             * @param {object} element Element containing the node graph
             * @param {object} paper Paper object
             * @param {bool} showMiniMap true if the mini map is shown, else false
             */
            function updateMiniMap(element, paper, showMiniMap) {
                if (!showMiniMap) {
                    return;
                }

                var miniMapContainer = jQuery(element).children(".gn-nodeGraphMiniMap");
                var sourceSvg = jQuery(element).children("svg");
                if (sourceSvg.length == 0) {
                    return;
                }

                // Get Positions and Viewports
                var viewBoundingBox = paper.getContentBBox();
                var scale = paper.scale().sx;
                var position = paper.translate();
                viewBoundingBox.x /= scale;
                viewBoundingBox.y /= scale;
                viewBoundingBox.width /= scale;
                viewBoundingBox.height /= scale;
                viewBoundingBox.x -= position.tx / scale;
                viewBoundingBox.y -= position.ty / scale;
                viewBoundingBox.right = viewBoundingBox.x + viewBoundingBox.width;
                viewBoundingBox.bottom = viewBoundingBox.y + viewBoundingBox.height;

                var parentElement = jQuery(element).parent();
                var viewPortBoundingBox = {
                    x: -position.tx / scale,
                    y: -position.ty / scale,
                    width: parentElement.width() / scale,
                    height: parentElement.height() / scale
                };

                // Adjust view bounding box to always incoperate camera
                if (viewPortBoundingBox.x < viewBoundingBox.x) {
                    viewBoundingBox.x = viewPortBoundingBox.x;
                }
                if (viewPortBoundingBox.x + viewPortBoundingBox.width > viewBoundingBox.right) {
                    viewBoundingBox.right = viewPortBoundingBox.x + viewPortBoundingBox.width;
                }

                if (viewPortBoundingBox.y < viewBoundingBox.y) {
                    viewBoundingBox.y = viewPortBoundingBox.y;
                }
                if (viewPortBoundingBox.y + viewPortBoundingBox.height > viewBoundingBox.bottom) {
                    viewBoundingBox.bottom = viewPortBoundingBox.y + viewPortBoundingBox.height;
                }

                // Get Node SVG and adjust it for mini map
                viewBoundingBox.width = viewBoundingBox.right - viewBoundingBox.x;
                viewBoundingBox.height = viewBoundingBox.bottom - viewBoundingBox.y;
                var miniMap = jQuery(sourceSvg[0].outerHTML);
                miniMap.attr("viewBox", viewBoundingBox.x + " " + viewBoundingBox.y + " " + viewBoundingBox.width + " " + viewBoundingBox.height);
                miniMap.children(".joint-viewport").removeAttr("transform");
                miniMap.find("rect").attr("fill-opacity", "1");
                miniMap.find("rect").attr("fill", "#666");
                miniMap.find("path").attr("fill", "none");
                miniMap.find(".tool-options").remove();
                miniMap.find(".tool-remove").remove();

                // Add viewport
                var viewPortStrokeWidth = viewBoundingBox.width / 400;
                miniMap.children(".joint-viewport").append("<rect width='" + viewPortBoundingBox.width + "' height='" + viewPortBoundingBox.height + "' transform='translate(" + viewPortBoundingBox.x + "," + viewPortBoundingBox.y + ")' fill='none' stroke='#fff' style='stroke-width: " + viewPortStrokeWidth + "'></rect>");

                miniMapContainer.html(miniMap[0].outerHTML);
            }

            /**
             * Updates the font size
             * @param {object} paper Paper
             * @param {object} element Element
             * @param {number} defaultFontSize Default font size 
             */
            function updateFontSize(paper, element, defaultFontSize) {
                var targetFontSize = roundToOneDigit(paper.scale().sx * defaultFontSize);
                jQuery(element).css("font-size", targetFontSize + "px");
            }

            /**
             * Clears the multi select elements
             * @param {object[]} multiSelectedElements 
             */
            function clearMultiselectElements(multiSelectedElements) {
                if (!multiSelectedElements) {
                    return;
                }

                for (var curElement = 0; curElement < multiSelectedElements.length; ++curElement) {
                    if (!multiSelectedElements[curElement].$box) {
                        continue;
                    }

                    multiSelectedElements[curElement].$box.removeClass("gn-multiSelected");
                }
            }

            /**
             * Zooms with a target
             * @param {object} event Event
             * @param {object} element Element
             * @param {object} paper JointJS paper
             * @param {boolean} showMiniMap true if the mini map is shown, else false
             * @param {boolean} enableNodeGraphPositionZoomUrl true if the url must be updated
             * @param {number} x Mouse X
             * @param {number} y Mouse Y
             * @param {number} delta Delta of the scale
             */
            function zoomOnTarget(event, paper, element, showMiniMap, enableNodeGraphPositionZoomUrl, x, y, delta) {
                event.preventDefault();

                var oldScale = paper.scale().sx;
                var newScale = oldScale + delta * scaleStep;

                if (newScale < minScale) {
                    return;
                }

                var beta = oldScale / newScale;
                var ax = x - (x * beta);
                var ay = y - (y * beta);
                var translate = paper.translate();

                var nextTx = translate.tx - ax * newScale;
                var nextTy = translate.ty - ay * newScale;

                paper.translate(nextTx, nextTy);
                paper.scale(newScale, newScale);

                if (enableNodeGraphPositionZoomUrl) {
                    debouncedUpdatePositionZoomUrl(paper);
                }
                throttledUpdatedMiniMap(element, paper, showMiniMap)
            };

            /**
             * Hides all children for a link
             * @param {object} container Container Element
             * @param {object} graph Graph
             * @param {object} paper Paper
             * @param {object} linkView Link view
             */
            function hideChildren(container, graph, paper, linkView) {
                if (!linkView.targetView) {
                    return;
                }

                var usedLinks = {};
                usedLinks[linkView] = true;
                var linksToCheck = [linkView];
                while (linksToCheck.length > 0) {
                    var curLink = linksToCheck.shift();
                    if (!curLink.targetView || !curLink.targetView.model) {
                        continue;
                    }
                    curLink.$el.addClass("node-link-hidden");

                    var targetView = curLink.targetView;
                    var targetElement = targetView.model;
                    var inboundLinks = graph.getConnectedLinks(targetElement, { inbound: true });
                    if (inboundLinks.length > 1) {
                        var allHidden = true;
                        for (var curConnectedLink = 0; curConnectedLink < inboundLinks.length; ++curConnectedLink) {
                            var parentLink = paper.findViewByModel(inboundLinks[curConnectedLink]);
                            if (!parentLink.$el.hasClass("node-link-hidden")) {
                                allHidden = false;
                                break;
                            }
                        }

                        if (!allHidden) {
                            continue;
                        }
                    }

                    targetView.$box.addClass("node-box-hidden");
                    targetView.$el.addClass("node-svg-hidden");

                    var connectedLinks = graph.getConnectedLinks(targetElement, { outbound: true });

                    for (var curConnectedLink = 0; curConnectedLink < connectedLinks.length; ++curConnectedLink) {
                        var childLinkView = paper.findViewByModel(connectedLinks[curConnectedLink]);
                        if (usedLinks[childLinkView.id]) {
                            continue;
                        }
                        linksToCheck.push(childLinkView);
                        usedLinks[childLinkView.id] = true;
                    }
                }

                container.find(".gn-nodeGraphShowAllNodes").show();
            }

            // Create throttled version of update mini map
            var throttledUpdatedMiniMap = GoNorth.Util.throttle(updateMiniMap, 35);
            var throttledupdatePositionZoomDisplay = GoNorth.Util.throttle(updatePositionZoomDisplay, 35);
            var debouncedUpdatePositionZoomUrl = GoNorth.Util.debounce(updatePositionZoomUrl, 250);

            /**
             * Node Graph Binding Handler
             */
            ko.bindingHandlers.nodeGraph = {
                init: function (element, valueAccessor, allBindings) {
                    var allowMultipleOutboundForNodes = false;
                    if (allBindings.get("nodeGraphAllowMultpleOutbound")) {
                        allowMultipleOutboundForNodes = allBindings.get("nodeGraphAllowMultpleOutbound");
                    }

                    var enableNodeGraphPositionZoomUrl = true;
                    if (allBindings.get("nodeGraphDisablePositionZoomUrl")) {
                        enableNodeGraphPositionZoomUrl = !allBindings.get("nodeGraphDisablePositionZoomUrl");
                    }

                    var markAvailable = true;
                    if (allBindings.get("nodeGraphDontMarkAvailablePorts")) {
                        markAvailable = false;
                    }

                    var allowSelfLink = false;
                    if (allBindings.get("nodeGraphAllowSelfLink")) {
                        allowSelfLink = true;
                    }

                    var disableLinkVertexEdit = false;
                    if (allBindings.get("nodeGraphDisableLinkVertexEdit")) {
                        disableLinkVertexEdit = true;
                    }

                    var linkCreationCallback = null;
                    if (allBindings.get("nodeGraphLinkCreationCallback")) {
                        linkCreationCallback = allBindings.get("nodeGraphLinkCreationCallback");
                    }

                    var graph = new joint.dia.Graph();
                    var paper = new joint.dia.Paper(
                        {
                            el: element,
                            width: 16000,
                            height: 8000,
                            gridSize: 1,
                            model: graph,
                            defaultLink: linkCreationCallback ? linkCreationCallback() : GoNorth.DefaultNodeShapes.Connections.createDefaultLink(),
                            snapLinks: { radius: 75 },
                            markAvailable: markAvailable,
                            linkPinning: false,
                            validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                                // Prevent linking from output ports to input ports within one element.
                                if (cellViewS === cellViewT && !allowSelfLink) {
                                    return false;
                                }

                                // Prevent linking to output ports.
                                return magnetT && magnetT.getAttribute("port-type") === "input";
                            },
                            validateMagnet: function (cellView, magnet) {
                                if (allowMultipleOutboundForNodes && !cellView.model.get("allowSingleConnectionOnly")) {
                                    return magnet.getAttribute("magnet") !== "passive";
                                }

                                var port = magnet.getAttribute("port");

                                // Delete old links on new drag
                                var links = graph.getConnectedLinks(cellView.model, { outbound: true });
                                for (var curLink = links.length - 1; curLink >= 0; --curLink) {
                                    if (links[curLink].attributes && links[curLink].attributes.source && links[curLink].attributes.source.port === port) {
                                        links[curLink].remove();
                                    }
                                }
                                return magnet.getAttribute("magnet") !== "passive";
                            },
                            interactive: function (cellView) {
                                if (disableLinkVertexEdit && cellView.model.isLink()) {
                                    return { vertexAdd: false, vertexMove: false, labelMove: false };
                                }
                                return true;
                            }
                        });

                    GoNorth.BindingHandlers.nodeGraphRefreshPositionZoomUrl = function () {
                        if (enableNodeGraphPositionZoomUrl) {
                            debouncedUpdatePositionZoomUrl(paper);
                        }
                    };

                    // Store default values
                    var defaultFontSize = jQuery(element).css("font-size");
                    if (defaultFontSize && defaultFontSize.replace) {
                        defaultFontSize = parseFloat(defaultFontSize.replace("px", ""));
                    }
                    if (!defaultFontSize) {
                        defaultFontSize = 14;
                    }

                    // Add mini Map update events
                    var showMiniMap = false;
                    graph.on("change", function () {
                        throttledUpdatedMiniMap(element, paper, showMiniMap);
                    });
                    graph.on('change:position', function (cell, pos, trans) {
                        if (!multiSelectedElements || trans.ignore) {
                            return;
                        }

                        var view = paper.findViewByModel(cell);
                        if (!view) {
                            clearMultiselectElements(multiSelectedElements);
                            multiSelectedElements = null;
                            return;
                        }

                        var elementSelected = false;
                        for (var curElement = 0; curElement < multiSelectedElements.length; ++curElement) {
                            if (multiSelectedElements[curElement] == view) {
                                elementSelected = true;
                            }
                        }

                        if (!elementSelected) {
                            clearMultiselectElements(multiSelectedElements);
                            multiSelectedElements = null;
                            return;
                        }

                        for (var curElement = 0; curElement < multiSelectedElements.length; ++curElement) {
                            if (multiSelectedElements[curElement] != view) {
                                multiSelectedElements[curElement].model.translate(trans.tx, trans.ty, { ignore: true });
                            }
                        }

                        for (var curElement = 0; curElement < multiSelectedElements.length; ++curElement) {
                            var outboundLinks = graph.getConnectedLinks(multiSelectedElements[curElement].model, { outbound: true });
                            for (var curLink = 0; curLink < outboundLinks.length; ++curLink) {
                                var oldVertices = outboundLinks[curLink].get("vertices");
                                if (!oldVertices) {
                                    continue;
                                }
                                var newVertices = [];
                                for (var curVertex = 0; curVertex < oldVertices.length; ++curVertex) {
                                    var newVertex = { x: oldVertices[curVertex].x, y: oldVertices[curVertex].y }
                                    newVertex.x += trans.tx;
                                    newVertex.y += trans.ty;
                                    newVertices.push(newVertex);
                                }
                                outboundLinks[curLink].set('vertices', newVertices);
                            }
                        }
                    });
                    graph.on("add", function () {
                        throttledUpdatedMiniMap(element, paper, showMiniMap);
                    });
                    graph.on("remove", function () {
                        throttledUpdatedMiniMap(element, paper, showMiniMap);
                    });
                    jQuery(window).on("resize", function () {
                        throttledUpdatedMiniMap(element, paper, showMiniMap);
                    });

                    // Set Observables
                    var graphObs = valueAccessor();
                    if (ko.isObservable(graphObs)) {
                        graphObs(graph);
                    }

                    var paperObs = allBindings.get("nodePaper");
                    if (paperObs && ko.isObservable(paperObs)) {
                        paperObs(paper);
                    }

                    // Zoom
                    paper.on('blank:mousewheel', function (event, x, y, delta) {
                        zoomOnTarget(event, paper, element, showMiniMap, enableNodeGraphPositionZoomUrl, x, y, delta);
                    });

                    paper.on('cell:mousewheel element:mousewheel', function (_cellView, event, x, y, delta) {
                        zoomOnTarget(event, paper, element, showMiniMap, enableNodeGraphPositionZoomUrl, x, y, delta);
                    });

                    jQuery(element).on("mousewheel DOMMouseScroll", ":not(svg)", function (event) {
                        // Make sure zoom also works on mousewheel of html elements
                        event.target = element;
                    });

                    jQuery(element).on("mousewheel DOMMouseScroll", function (event) {
                        event.preventDefault();
                    });

                    // Pan
                    var dragStartPosition = null;
                    var blockStart = false;
                    var multiSelectOverlay = null;
                    var multiSelectElement = null;
                    var multiSelectStartPosition = null;
                    var multiSelectedElements = null;
                    paper.on('blank:pointerdown', function (event, x, y) {
                        clearMultiselectElements(multiSelectedElements);
                        multiSelectedElements = null;

                        if (event.ctrlKey) {
                            multiSelectStartPosition = { x: event.offsetX, paperX: x, y: event.offsetY, paperY: y };
                            multiSelectOverlay = jQuery("<div class='gn-multiSelectBackgroundOverlay'></div>")
                            multiSelectElement = jQuery("<div class='gn-multiSelectRectangle' style='left: " + event.offsetX + "px; top: " + event.offsetY + "px; width: 1px; height: 1px;'></div>");
                            jQuery(element).append(multiSelectOverlay);
                            multiSelectOverlay.append(multiSelectElement);
                            return;
                        }

                        jQuery(element).addClass("gn-nodeGraph-dragging");
                        if (!blockStart) {
                            dragStartPosition = { x: x * paper.scale().sx, y: y * paper.scale().sy };
                        }
                    });

                    paper.on('cell:pointerup blank:pointerup', function (cellView, x, y) {
                        if (multiSelectOverlay) {
                            var left = Math.min(x, multiSelectStartPosition.paperX);
                            var right = Math.max(x, multiSelectStartPosition.paperX);
                            var top = Math.min(y, multiSelectStartPosition.paperY);
                            var bottom = Math.max(y, multiSelectStartPosition.paperY);
                            multiSelectedElements = paper.findViewsInArea({
                                x: left,
                                y: top,
                                width: right - left,
                                height: bottom - top
                            });

                            for (var curElement = 0; curElement < multiSelectedElements.length; ++curElement) {
                                if (!multiSelectedElements[curElement].$box) {
                                    continue;
                                }

                                multiSelectedElements[curElement].$box.addClass("gn-multiSelected");
                            }

                            multiSelectElement.remove();
                            multiSelectOverlay.remove();
                            multiSelectElement = null;
                            multiSelectOverlay = null;
                            return;
                        }

                        jQuery(element).removeClass("gn-nodeGraph-dragging");
                        dragStartPosition = null;
                    });

                    jQuery(element).on("mousemove", function (event) {
                        if (multiSelectElement) {
                            var left = Math.min(event.offsetX, multiSelectStartPosition.x);
                            var right = Math.max(event.offsetX, multiSelectStartPosition.x);
                            var top = Math.min(event.offsetY, multiSelectStartPosition.y);
                            var bottom = Math.max(event.offsetY, multiSelectStartPosition.y);
                            multiSelectElement.css("left", left);
                            multiSelectElement.css("top", top);
                            multiSelectElement.css("width", right - left);
                            multiSelectElement.css("height", bottom - top);
                            return;
                        }

                        if (dragStartPosition) {
                            paper.translate(event.offsetX - dragStartPosition.x, event.offsetY - dragStartPosition.y);
                            if (enableNodeGraphPositionZoomUrl) {
                                debouncedUpdatePositionZoomUrl(paper);
                            }
                            throttledUpdatedMiniMap(element, paper, showMiniMap);
                        }
                    });

                    // Touch
                    var dragStartTransform = null;
                    var dragStartDistance = null;
                    var dragStartScale = null;
                    jQuery(element).find("svg").on("touchstart", function (event) {
                        if (jQuery(event.target).attr("id") != jQuery(element).find("svg").attr("id")) {
                            return;
                        }

                        if (event.originalEvent.touches && event.originalEvent.touches.length == 1) {
                            dragStartPosition = { x: event.originalEvent.touches[0].screenX, y: event.originalEvent.touches[0].screenY };
                            dragStartTransform = { x: paper.translate().tx, y: paper.translate().ty }
                            blockStart = true;
                            setTimeout(function () {
                                blockStart = false;
                            }, 10);
                        }
                        else if (event.originalEvent.touches && event.originalEvent.touches.length == 2) {
                            dragStartDistance = calcTouchDistance(event.originalEvent.touches);
                            dragStartScale = paper.scale().sx;
                        }
                    });

                    jQuery(element).on("click", "input,select,textarea,button", function () {
                        clearMultiselectElements(multiSelectedElements);
                        multiSelectedElements = null;
                    });

                    jQuery(element).on("touchmove", function (event) {
                        if (dragStartPosition && event.originalEvent.touches && event.originalEvent.touches.length == 1) {
                            paper.translate(event.originalEvent.touches[0].screenX - dragStartPosition.x + dragStartTransform.x, event.originalEvent.touches[0].screenY - dragStartPosition.y + dragStartTransform.y);
                            if (enableNodeGraphPositionZoomUrl) {
                                debouncedUpdatePositionZoomUrl(paper);
                            }
                            throttledUpdatedMiniMap(element, paper, showMiniMap);
                        }
                        else if (dragStartDistance && event.originalEvent.touches && event.originalEvent.touches.length == 2) {
                            var newDistance = calcTouchDistance(event.originalEvent.touches);
                            var newScale = dragStartScale * (newDistance / dragStartDistance);
                            if (newScale >= minScale) {
                                paper.scale(newScale, newScale);
                                if (enableNodeGraphPositionZoomUrl) {
                                    debouncedUpdatePositionZoomUrl(paper);
                                }
                                throttledUpdatedMiniMap(element, paper, showMiniMap);
                            }
                        }
                    });

                    jQuery(element).on("touchend touchcancel", function (event) {
                        dragStartPosition = null;
                        dragStartTransform = null;
                        dragStartDistance = null;
                        dragStartScale = null;
                    });

                    // Url Position / Zoom
                    var urlPositionX = parseFloat(GoNorth.Util.getParameterFromUrl("nodeX"));
                    var urlPositionY = parseFloat(GoNorth.Util.getParameterFromUrl("nodeY"));
                    var urlZoom = parseFloat(GoNorth.Util.getParameterFromUrl("nodeZoom"));
                    if (!isNaN(urlPositionX) && !isNaN(urlPositionY)) {
                        paper.translate(urlPositionX, urlPositionY);
                    }
                    if (!isNaN(urlZoom)) {
                        paper.scale(urlZoom, urlZoom);
                    }

                    // Styling
                    jQuery(element).addClass("gn-nodeGraph");

                    jQuery(element).append("<div class='gn-nodeGraphPositionZoomIndicator'><span class='gn-nodeGraphPositionZoomIndicatorText'></span><span><a class='gn-clickable gn-nodeGraphToogleMinimap' title='" + GoNorth.DefaultNodeShapes.Localization.NodeDisplay.ToogleMiniMap + "'><i class='glyphicon glyphicon-chevron-down'></i></a></span></div>");
                    jQuery(element).append("<div class='gn-nodeGraphShowAllNodes' style='display: none'>" + GoNorth.DefaultNodeShapes.Localization.NodeDisplay.ShowAllNodes + "</div>");
                    jQuery(element).append("<div class='gn-nodeGraphMiniMap' style='display: none'></div>");

                    jQuery(element).find(".gn-nodeGraphPositionZoomIndicator").css("font-size", defaultFontSize + "px");
                    jQuery(element).find(".gn-nodeGraphShowAllNodes").css("font-size", defaultFontSize + "px");
                    jQuery(element).find(".gn-nodeGraphToogleMinimap").on("click", function () {
                        showMiniMap = !showMiniMap;
                        if (showMiniMap) {
                            jQuery(element).find(".gn-nodeGraphMiniMap").slideDown(200);
                            jQuery(this).children("i").removeClass("glyphicon-chevron-down");
                            jQuery(this).children("i").addClass("glyphicon-chevron-up");
                            throttledUpdatedMiniMap(element, paper, showMiniMap);
                        }
                        else {
                            jQuery(element).find(".gn-nodeGraphMiniMap").slideUp(200);
                            jQuery(this).children("i").removeClass("glyphicon-chevron-up");
                            jQuery(this).children("i").addClass("glyphicon-chevron-down");
                        }
                    });

                    // Event Handlers
                    paper.on("link:options", function (linkView) {
                        var link = linkView.model;
                        var existingText = "";
                        var existingLabel = link.label(0);
                        if (existingLabel && existingLabel.attrs && existingLabel.attrs.text && existingLabel.attrs.text.text) {
                            existingText = existingLabel.attrs.text.text;
                        }
                        GoNorth.PromptService.openInputPrompt(GoNorth.DefaultNodeShapes.Localization.Links.EnterName, existingText).done(function (label) {
                            link.label(0, { attrs: { text: { text: label } } });
                        });
                    });

                    paper.on("link:hide", function (linkView) {
                        hideChildren(jQuery(element), graph, paper, linkView);
                    });

                    jQuery(element).find(".gn-nodeGraphShowAllNodes").on("click", function () {
                        jQuery(element).find(".node-box-hidden").removeClass("node-box-hidden");
                        jQuery(element).find(".node-svg-hidden").removeClass("node-svg-hidden");
                        jQuery(element).find(".node-link-hidden").removeClass("node-link-hidden");
                        jQuery(element).find(".gn-nodeGraphShowAllNodes").hide();
                    });

                    // Initialize
                    updatePositionZoomDisplay(element, paper);
                    if (enableNodeGraphPositionZoomUrl) {
                        debouncedUpdatePositionZoomUrl(paper);
                    }
                    paper.on("translate", function () {
                        throttledupdatePositionZoomDisplay(element, paper);
                    });

                    updateFontSize(paper, element, defaultFontSize);
                    paper.on("scale", function () {
                        updateFontSize(paper, element, defaultFontSize);
                        throttledupdatePositionZoomDisplay(element, paper);
                    });
                },
                update: function (element, valueAccessor) {
                }
            }

        }

    }(GoNorth.BindingHandlers = GoNorth.BindingHandlers || {}));
}(window.GoNorth = window.GoNorth || {}));