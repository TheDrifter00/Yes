(function(GoNorth) {
    "use strict";
    (function(DefaultNodeShapes) {
        (function(Connections) {

            /**
             * Creates a default link
             * @param {object} initData Data for initalizing
             */
            Connections.createDefaultLink = function(initData) {
                var linkData = {
                    attrs: {
                        ".marker-target": { d: "M 10 0 L 0 5 L 10 10 z" },
                        ".link-tools .tool-remove circle, .marker-vertex": { r: 8 },
                        ".link-tools .tool-remove title": { text: DefaultNodeShapes.Localization.Links.Delete },
                        ".link-tools .tool-options title": { text: DefaultNodeShapes.Localization.Links.Rename },
                        ".link-tools .tool-hide title": { text: DefaultNodeShapes.Localization.Links.Hide },
                        ".link-tools .tool-options": { class: "tool-options gn-showLinkOptions" }
                    },
                    toolMarkup: '<g class="link-tool">' +
                                    '<g class="tool-remove" event="remove">' +
                                        '<circle r="11" />' +
                                        '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z" />' +
                                        '<title>Remove link.</title>' +
                                    '</g>' +
                                    '<g class="tool-options" event="link:options">' +
                                        '<circle r="11" transform="translate(25)" />' +
                                        '<path fill="white" transform="scale(.55) translate(29, -16)" d="M31.229,17.736c0.064-0.571,0.104-1.148,0.104-1.736s-0.04-1.166-0.104-1.737l-4.377-1.557c-0.218-0.716-0.504-1.401-0.851-2.05l1.993-4.192c-0.725-0.91-1.549-1.734-2.458-2.459l-4.193,1.994c-0.647-0.347-1.334-0.632-2.049-0.849l-1.558-4.378C17.165,0.708,16.588,0.667,16,0.667s-1.166,0.041-1.737,0.105L12.707,5.15c-0.716,0.217-1.401,0.502-2.05,0.849L6.464,4.005C5.554,4.73,4.73,5.554,4.005,6.464l1.994,4.192c-0.347,0.648-0.632,1.334-0.849,2.05l-4.378,1.557C0.708,14.834,0.667,15.412,0.667,16s0.041,1.165,0.105,1.736l4.378,1.558c0.217,0.715,0.502,1.401,0.849,2.049l-1.994,4.193c0.725,0.909,1.549,1.733,2.459,2.458l4.192-1.993c0.648,0.347,1.334,0.633,2.05,0.851l1.557,4.377c0.571,0.064,1.148,0.104,1.737,0.104c0.588,0,1.165-0.04,1.736-0.104l1.558-4.377c0.715-0.218,1.399-0.504,2.049-0.851l4.193,1.993c0.909-0.725,1.733-1.549,2.458-2.458l-1.993-4.193c0.347-0.647,0.633-1.334,0.851-2.049L31.229,17.736zM16,20.871c-2.69,0-4.872-2.182-4.872-4.871c0-2.69,2.182-4.872,4.872-4.872c2.689,0,4.871,2.182,4.871,4.872C20.871,18.689,18.689,20.871,16,20.871z" />' +
                                        '<title>Link options.</title>' +
                                    '</g>' +
                                    '<g class="tool-hide" event="link:hide" transform="translate(55)">' +
                                        '<circle r="11"/>' +
                                        '<path fill="white" transform="scale(.55) translate(-16, -16)" d="M16,7.55762c-5.7793,0-11.09814,2.63477-14.59229,7.22754c-0.54492,0.71533-0.54492,1.71436-0.00049,2.42871   C4.90186,21.80762,10.2207,24.44238,16,24.44238s11.09814-2.63477,14.59229-7.22754   c0.54492-0.71533,0.54492-1.71338,0.00049-2.42871C27.09814,10.19238,21.7793,7.55762,16,7.55762z M29.00098,16.00293   C25.8877,20.09521,21.14893,22.44238,16,22.44238s-9.8877-2.34717-13.00098-6.44531C6.1123,11.90479,10.85107,9.55762,16,9.55762   s9.8877,2.34717,13.00098,6.43945C29.00098,15.99756,29.00098,16.00244,29.00098,16.00293z" />'+
                                        '<path fill="white" transform="scale(.55) translate(-16, -16)" d="M16,10.146c-3.22803,0-5.854,2.62598-5.854,5.854s2.62598,5.854,5.854,5.854s5.854-2.62598,5.854-5.854   S19.22803,10.146,16,10.146z M16,19.854c-2.125,0-3.854-1.729-3.854-3.854s1.729-3.854,3.854-3.854s3.854,1.729,3.854,3.854   S18.125,19.854,16,19.854z" />' +
                                        '<title>Remove link.</title>' +
                                    '</g>' +
                                '</g>'
                };
                if(initData)
                {
                    linkData = jQuery.extend(initData, linkData);
                }
                var link = new joint.dia.Link(linkData);
                link.set("smooth", true);
                return link;
            };

        }(DefaultNodeShapes.Connections = DefaultNodeShapes.Connections || {}));
    }(GoNorth.DefaultNodeShapes = GoNorth.DefaultNodeShapes || {}));
}(window.GoNorth = window.GoNorth || {}));
(function (GoNorth) {
    "use strict";
    (function (DefaultNodeShapes) {
        (function (Shapes) {


            joint.shapes.default = joint.shapes.default || {};

            /**
             * Base Shape
             */
            joint.shapes.default.Base = joint.shapes.devs.Model.extend(
                {
                    defaults: joint.util.deepSupplement
                        (
                            {
                                type: 'default.Base',
                                size: { width: 200, height: 64 },
                                nodeText: '',
                                attrs:
                                {
                                    rect: { stroke: 'none', 'fill-opacity': 0 },
                                    text: { display: 'none' },
                                },
                            },
                            joint.shapes.devs.Model.prototype.defaults
                        ),
                });

            /**
             * Base Shape View
             */
            joint.shapes.default.BaseView = joint.shapes.devs.ModelView.extend(
                {
                    /**
                     * Template
                     */
                    template:
                        [
                            '<div class="node">',
                            '<span class="label"><i class="nodeIcon glyphicon"></i><span class="labelText"></span></span>',
                            '<button class="delete" title="' + GoNorth.DefaultNodeShapes.Localization.DeleteNode + '">x</button>',
                            '</div>',
                        ].join(''),

                    /**
                     * Initializes the shape
                     */
                    initialize: function () {
                        _.bindAll(this, 'updateBox');
                        joint.shapes.devs.ModelView.prototype.initialize.apply(this, arguments);

                        this.$box = jQuery(_.template(this.template)());
                        // Prevent paper from handling pointerdown.
                        this.$box.find('input').on('mousedown click', function (evt) { evt.stopPropagation(); });

                        this.$box.find('.nodeText').on('input', _.bind(function (evt) {
                            this.model.set('nodeText', jQuery(evt.target).val());
                        }, this));

                        this.$box.find('.delete').on('click', _.bind(function () {
                            if (!this.model.onDelete) {
                                this.model.remove();
                            }
                            else {
                                var self = this;
                                this.model.onDelete(this).done(function () {
                                    self.model.remove();
                                });
                            }
                        }, this));
                        Shapes.initFullscreenMode(this.$box);

                        if (this.additionalCallbackButtons) {
                            var callbacks = this.additionalCallbackButtons;
                            var self = this;
                            jQuery.each(callbacks, function (key) {
                                self.$box.find("." + key).on("click", _.bind(function () {
                                    callbacks[key].apply(self);
                                }, self));
                            });
                        }

                        this.model.on('change', this.updateBox, this);
                        this.model.on('remove', this.removeBox, this);

                        this.updateBox();
                    },

                    /**
                     * Renders the shape
                     */
                    render: function () {
                        joint.shapes.devs.ModelView.prototype.render.apply(this, arguments);

                        this.listenTo(this.paper, "scale", this.updateBox);
                        this.listenTo(this.paper, "translate", this.updateBox);

                        this.paper.$el.prepend(this.$box);
                        this.updateBox();
                        return this;
                    },

                    /**
                     * Updates the box
                     */
                    updateBox: function () {
                        var bbox = this.model.getBBox();
                        if (this.paper) {
                            bbox.x = bbox.x * this.paper.scale().sx + this.paper.translate().tx;
                            bbox.y = bbox.y * this.paper.scale().sy + this.paper.translate().ty;
                            bbox.width *= this.paper.scale().sx;
                            bbox.height *= this.paper.scale().sy;
                        }

                        var textField = this.$box.find('.nodeText');
                        if (!textField.is(':focus')) {
                            textField.val(this.model.get('nodeText'));
                        }

                        var label = this.$box.find('.labelText');
                        var type = this.model.get('type');
                        label.text(DefaultNodeShapes.Localization.TypeNames[type]);
                        this.$box.find('.label').attr('class', 'label ' + type.replace(".", "_"));

                        if (this.model.get("icon")) {
                            this.$box.find(".nodeIcon").addClass(this.model.get("icon"));
                        }
                        else {
                            this.$box.find(".nodeIcon").remove();
                        }

                        this.$box.css({ width: bbox.width, height: bbox.height, left: bbox.x, top: bbox.y, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' });
                    },

                    /**
                     * Removes the box
                     */
                    removeBox: function (evt) {
                        this.$box.remove();
                    },

                    /**
                     * Checks if a node can be deleted
                     * 
                     * @returns {jQuery.Deferred} Deferred for the validation process
                     */
                    validateDelete: function () {
                        return null;
                    },

                    /**
                     * Returns statistics for the node
                     * @returns Node statistics
                     */
                    getStatistics: function () {
                        return {
                            wordCount: GoNorth.Util.getWordCount(this.model.get('nodeText'))
                        };
                    }
                });

            /**
             * Initializes the fullscreen mode
             */
            Shapes.initFullscreenMode = function (contentElement) {
                contentElement.find('.toggleFullscreen').on('click', function (evt) {
                    var targetElement = jQuery(evt.target).closest("[data-target]").data('target');
                    GoNorth.PromptService.openInputPrompt(GoNorth.DefaultNodeShapes.Localization.EditText, contentElement.find(targetElement).val(), false, true, true).done(function (newContent) {
                        contentElement.find(targetElement).val(newContent).change().trigger("input");
                    });
                })
            };

        }(DefaultNodeShapes.Shapes = DefaultNodeShapes.Shapes || {}));
    }(GoNorth.DefaultNodeShapes = GoNorth.DefaultNodeShapes || {}));
}(window.GoNorth = window.GoNorth || {}));
(function(GoNorth) {
    "use strict";
    (function(DefaultNodeShapes) {
        (function(Shapes) {

            /**
             * Text Shape
             */
            joint.shapes.default.Text = joint.shapes.devs.Model.extend(
            {
                defaults: joint.util.deepSupplement
                (
                    {
                        type: 'default.Text',
                        inPorts: ['input'],
                        outPorts: ['output'],
                        attrs:
                        {
                            '.outPorts circle': { unlimitedConnections: ['default.Choice'], }
                        },
                    },
                    joint.shapes.default.Base.prototype.defaults
                )
            });

            /**
             * Text View
             */
            joint.shapes.default.TextView = joint.shapes.default.BaseView.extend(
            {
                /**
                 * Template
                 */
                template:
                [
                    '<div class="node">',
                        '<span class="label"></span>',
                        '<button class="delete" title="' + GoNorth.DefaultNodeShapes.Localization.DeleteNode + '">x</button>',
                        '<input type="text" class="name" placeholder="' + DefaultNodeShapes.Localization.TextPlaceHolder + '" />',
                    '</div>',
                ].join('')
            });

        }(DefaultNodeShapes.Shapes = DefaultNodeShapes.Shapes || {}));
    }(GoNorth.DefaultNodeShapes = GoNorth.DefaultNodeShapes || {}));
}(window.GoNorth = window.GoNorth || {}));
(function(GoNorth) {
    "use strict";
    (function(DefaultNodeShapes) {
        (function(Serialize) {

            /** 
             * Node Serializer Base
             * 
             * @param {object} classType Class Type
             * @param {string} type Type for the serialization
             * @param {string} serializeArrayName Name of the target array for the serialization
             * @class
             */
            Serialize.BaseNodeSerializer = function(classType, type, serializeArrayName) {
                this.classType = classType;
                this.type = type;
                this.serializeArrayName = serializeArrayName;
            }

            Serialize.BaseNodeSerializer.prototype = {
                /**
                 * Serializes a node
                 * 
                 * @param {object} node Node Object
                 * @returns {object} Serialized NOde
                 */
                serialize: function(node) {

                },

                /**
                 * Deserializes a serialized node
                 * 
                 * @param {object} node Serialized Node Object
                 * @returns {object} Deserialized Node
                 */
                deserialize: function(node) {

                },

                /**
                 * Creates a new node
                 * @param {object} initOptions Init Options
                 * @returns {object} New Node
                 */
                createNewNode: function(initOptions) {
                    return new this.classType(initOptions);
                }
            }

        }(DefaultNodeShapes.Serialize = DefaultNodeShapes.Serialize || {}));
    }(GoNorth.DefaultNodeShapes = GoNorth.DefaultNodeShapes || {}));
}(window.GoNorth = window.GoNorth || {}));
(function(GoNorth) {
    "use strict";
    (function(DefaultNodeShapes) {
        (function(Serialize) {

            /// Link Name
            var linkName = "link";

            /**
             * Serializer
             * @class
             */
            var serializer = function()
            {
                this.nodeSerializer = {};
                this.nodeDeserializer = {};
            };

            serializer.prototype = {
                /**
                 * Adds a node serializer
                 * 
                 * @param {object} nodeSerializer Node Serializer
                 */
                addNodeSerializer: function(nodeSerializer) {
                    this.nodeSerializer[nodeSerializer.type] = nodeSerializer;
                    this.nodeDeserializer[nodeSerializer.serializeArrayName] = nodeSerializer;
                },

                /**
                 * Returns true if a serializes exists for a target array name
                 * 
                 * @param {string} targetArrayName Target Array Name
                 * @returns {bool} true if a serializer exists, else false
                 */
                hasDeserializerForArray: function(targetArrayName) {
                    if(targetArrayName == linkName)
                    {
                        return true;
                    }
                    return !!this.nodeDeserializer[targetArrayName];
                },

                /**
                 * Serializes a graph
                 * 
                 * @returns {object} Serialized Objects
                 */
                serializeGraph: function(graph) {
                    var serializedGraph = graph.toJSON();
                    var serializedObjects = {};
                    serializedObjects[linkName] = [];
                    for(var curCell = 0; curCell < serializedGraph.cells.length; ++curCell)
                    {
                        var cellType = serializedGraph.cells[curCell].type;
                        if(cellType == linkName)
                        {
                            serializedObjects[linkName].push(this.serializeLink(serializedGraph.cells[curCell]));
                        }
                        else
                        {
                            if(!this.nodeSerializer[cellType])
                            {
                                throw { error: "Unknown node type: " + cellType };
                            }

                            var targetArrayName = this.nodeSerializer[cellType].serializeArrayName;
                            if(!serializedObjects[targetArrayName])
                            {
                                serializedObjects[targetArrayName] = [];
                            }

                            serializedObjects[targetArrayName].push(this.nodeSerializer[cellType].serialize(serializedGraph.cells[curCell]));
                        }
                    }

                    return serializedObjects;
                },

                /**
                 * Deserializes a graph
                 * 
                 * @param {object} targetGraph Graph to fill
                 * @param {object} serializedData Serialized Data
                 * @param {function} nodeAddCallback Optional Callback function which gets called for each new node added to the graph
                 * @param {function} linkCreationCallback Optional Callback function for creating a link, if non is provided the default will be used
                 */
                deserializeGraph: function(targetGraph, serializedData, nodeAddCallback, linkCreationCallback) {
                    targetGraph.clear();
                    for(var curNodeCollection in serializedData)
                    {
                        if(!this.nodeDeserializer[curNodeCollection])
                        {
                            continue;
                        }

                        var nodeCollection = serializedData[curNodeCollection];
                        if(!nodeCollection)
                        {
                            continue;
                        }

                        for(var curNode = 0; curNode < nodeCollection.length; ++curNode)
                        {
                            var newNode = this.nodeDeserializer[curNodeCollection].deserialize(nodeCollection[curNode]);
                            targetGraph.addCell(newNode);
                            if(typeof nodeAddCallback === "function")
                            {
                                nodeAddCallback(newNode);
                            }
                        }
                    }

                    var linkCollection = serializedData[linkName];
                    if(linkCollection)
                    {
                        for(var curLink = 0; curLink < linkCollection.length; ++curLink)
                        {
                            var newLink = this.deserializeLink(linkCollection[curLink], linkCreationCallback);
                            targetGraph.addCell(newLink);
                        }
                    }
                },


                /**
                 * Serializes a link
                 * 
                 * @param {object} linkObject Link object to serialize
                 * @returns {object} Serialized link
                 */
                serializeLink: function(linkObject) {
                    var serializedLink = {
                        sourceNodeId: linkObject.source.id,
                        sourceNodePort: linkObject.source.port,
                        targetNodeId: linkObject.target.id,
                        targetNodePort: linkObject.target.port,
                        vertices: linkObject.vertices
                    };

                    if(linkObject.labels && linkObject.labels.length > 0 && linkObject.labels[0].attrs && linkObject.labels[0].attrs.text) {
                        serializedLink["label"] = linkObject.labels[0].attrs.text.text ? linkObject.labels[0].attrs.text.text : "";
                    }

                    return serializedLink;
                },

                /**
                 * Deserializes a link
                 * 
                 * @param {object} serializedLink Serialized link
                 * @param {function} linkCreationCallback Optional Callback function for creating a link, if non is provided the default will be used
                 */
                deserializeLink: function(serializedLink, linkCreationCallback) {
                    var linkData = {
                        source: 
                        { 
                            id: serializedLink.sourceNodeId,
                            port: serializedLink.sourceNodePort
                        },
                        target: 
                        { 
                            id: serializedLink.targetNodeId,
                            port: serializedLink.targetNodePort
                        },
                        vertices: serializedLink.vertices
                    };

                    if(serializedLink.label) {
                        linkData.labels = [
                            {
                                attrs: {
                                    text: {
                                        text: serializedLink.label
                                    }
                                }
                            }
                        ]
                    }

                    var linkObject = linkCreationCallback ? linkCreationCallback(linkData) : DefaultNodeShapes.Connections.createDefaultLink(linkData);

                    return linkObject;
                },



                /**
                 * Creates a new node
                 * 
                 * @param {string} type Node Type
                 * @param {object} initOptions Init Options
                 * @returns {object} New Node
                 */
                createNewNode: function(type, initOptions) {
                    if(!this.nodeSerializer[type])
                    {
                        return null;
                    }

                    return this.nodeSerializer[type].createNewNode(initOptions);
                },

                /**
                 * Returns the known node types
                 * @returns {string[]} Node types
                 */
                getKnownNodeTypes: function() {
                    return Object.keys(this.nodeSerializer);
                }
            };


            var serializerInstance = new serializer();

            /**
             * Returns the serializer instance
             * 
             * @returns {object} Node Graph Serializer
             */
            Serialize.getNodeSerializerInstance = function() {
                return serializerInstance;
            }

        }(DefaultNodeShapes.Serialize = DefaultNodeShapes.Serialize || {}));
    }(GoNorth.DefaultNodeShapes = GoNorth.DefaultNodeShapes || {}));
}(window.GoNorth = window.GoNorth || {}));
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