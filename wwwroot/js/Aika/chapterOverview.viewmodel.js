/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/

(function(jQuery){
	
	jQuery.hotkeys = {
		version: "0.8",

		specialKeys: {
			8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
			20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
			37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del", 
			96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
			104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/", 
			112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8", 
			120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
		},
	
		shiftNums: {
			"`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", 
			"8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<", 
			".": ">",  "/": "?",  "\\": "|"
		}
	};

	function keyHandler( handleObj ) {
		// Only care when a possible input has been specified
		if ( typeof handleObj.data !== "string" ) {
			return;
		}
		
		var origHandler = handleObj.handler,
			keys = handleObj.data.toLowerCase().split(" "),
			textAcceptingInputTypes = ["text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime", "datetime-local", "search", "color"];
	
		handleObj.handler = function( event ) {
			// Don't fire in text-accepting inputs that we didn't directly bind to
			if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
				jQuery.inArray(event.target.type, textAcceptingInputTypes) > -1 ) ) {
				return;
			}
			
			// Keypress represents characters, not special keys
			var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
				character = String.fromCharCode( event.which ).toLowerCase(),
				key, modif = "", possible = {};

			// check combinations (alt|ctrl|shift+anything)
			if ( event.altKey && special !== "alt" ) {
				modif += "alt+";
			}

			if ( event.ctrlKey && special !== "ctrl" ) {
				modif += "ctrl+";
			}
			
			// TODO: Need to make sure this works consistently across platforms
			if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
				modif += "meta+";
			}

			if ( event.shiftKey && special !== "shift" ) {
				modif += "shift+";
			}

			if ( special ) {
				possible[ modif + special ] = true;

			} else {
				possible[ modif + character ] = true;
				possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;

				// "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
				if ( modif === "shift+" ) {
					possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
				}
			}

			for ( var i = 0, l = keys.length; i < l; i++ ) {
				if ( possible[ keys[i] ] ) {
					return origHandler.apply( this, arguments );
				}
			}
		};
	}

	jQuery.each([ "keydown", "keyup", "keypress" ], function() {
		jQuery.event.special[ this ] = { add: keyHandler };
	});

})( jQuery );
(function(GoNorth) {
    "use strict";
    (function(SaveUtil) {

        /**
         * Prepares a save hotkey
         * @param {function} callback Callback function for saving
         */
         SaveUtil.setupSaveHotkey = function(callback) {
            jQuery(document).on("keydown", "*", "ctrl+s", function(event) {
                event.stopPropagation();
                event.preventDefault();
                callback();
            });
        };

    }(GoNorth.SaveUtil = GoNorth.SaveUtil || {}));
}(window.GoNorth = window.GoNorth || {}));
(function(GoNorth) {
    "use strict";
    (function(SaveUtil) {

            /// Auto save interval in milliseconds
            var autoSaveInterval = 60000;

            /**
             * Class to run dirty checks
             * @param {function} buildObjectSnapshot Function that builds a snapshot of the current data
             * @param {string} dirtyMessage Message that is shown if dirty chagnes exist and the user wants to navigate away from the page
             * @param {boolean} isAutoSaveDisabled true if auto save is disabled, else false
             * @param {function} saveCallback Function that will get called if an auto save is triggered
             * @class
             */
            SaveUtil.DirtyChecker = function(buildObjectSnapshot, dirtyMessage, isAutoSaveDisabled, saveCallback)
            {
                var self = this;
                window.addEventListener("beforeunload", function (e) {
                    return self.runDirtyCheck(e);
                });

                this.dirtyMessage = dirtyMessage;
                this.buildObjectSnapshot = buildObjectSnapshot;
                this.lastSnapshot = null;

                if(!isAutoSaveDisabled) {
                    this.saveCallback = saveCallback;
                    this.autoSaveInterval = setInterval(function() {
                        self.runAutoSave();
                    }, autoSaveInterval);
                }
            };

            SaveUtil.DirtyChecker.prototype = {
                /**
                 * Runs a dirty check
                 * @param {object} e Event object
                 * @returns {string} null if no change was triggered, else true
                 */
                runDirtyCheck: function(e) {
                    if(!this.isDirty()) {
                        return null;
                    }

                    e.preventDefault();
                    (e || window.event).returnValue = this.dirtyMessage;
                    return this.dirtyMessage;
                },

                /**
                 * Saves the current snapshot
                 */
                saveCurrentSnapshot: function() {
                    // Ensure async processing is done
                    var self = this;
                    jQuery(document).ajaxStop(function () {
                        setTimeout(function() {
                            self.lastSnapshot = self.buildObjectSnapshot();
                        }, 1);
                    });
                },

                /**
                 * Returns true if the object is currently dirty, else false
                 * @returns {boolean} True if the object is currently dirty, else
                 */
                isDirty: function() {
                    var currentSnapshot = this.buildObjectSnapshot();
                    var isSame = GoNorth.Util.isEqual(this.lastSnapshot, currentSnapshot);
                    return !isSame;
                },


                /**
                 * Runs an auto save command
                 */
                runAutoSave: function() {
                    if(!this.isDirty()) {
                        return;
                    }

                    this.saveCallback();   
                }
            };

    }(GoNorth.SaveUtil = GoNorth.SaveUtil || {}));
}(window.GoNorth = window.GoNorth || {}));
(function(GoNorth) {
    "use strict";
    (function(DefaultNodeShapes) {

        /**
         * Node Shapes Base View Model
         * @class
         */
        DefaultNodeShapes.BaseViewModel = function()
        {
            this.nodeGraph = new ko.observable();
            this.nodePaper = new ko.observable();
        
            this.showConfirmNodeDeleteDialog = new ko.observable(false);
            this.deleteLoading = new ko.observable(false);
            this.deleteErrorOccured = new ko.observable(false);
            this.deleteErrorAdditionalInformation =  new ko.observable("");
            this.deleteNodeTarget = null;
            this.deleteDeferred = null;

            this.nodeDropOffsetX = 0;
            this.nodeDropOffsetY = 0;

            this.errorOccured = new ko.observable(false);
        };

        DefaultNodeShapes.BaseViewModel.prototype = {

            /**
             * Adds a new node
             * 
             * @param {object} dropElement Element that was dropped
             * @param {float} x X-Drop Coordinate
             * @param {float} z X-Drop Coordinate
             */
            addNewNode: function(dropElement, x, y) {
                if(!this.nodeGraph() || !this.nodePaper())
                {
                    return;
                }

                var initOptions = this.calcNodeInitOptionsPosition(x, y);
                this.addNodeByType(dropElement.data("nodetype"), initOptions);
            },

            /**
             * Creates the node init options with the node position
             * 
             * @param {float} x X-Drop Coordinate
             * @param {float} z X-Drop Coordinate
             */
            calcNodeInitOptionsPosition: function(x, y) {
                var scale = this.nodePaper().scale();
                var translate = this.nodePaper().translate();
                var initOptions = {
                    position: { x: (x - translate.tx) / scale.sx + this.nodeDropOffsetX, y: (y - translate.ty) / scale.sy + this.nodeDropOffsetY }
                };
                return initOptions;
            },

            /**
             * Adds a new node by the type
             * 
             * @param {string} nodeType Type of the new node
             * @param {object} initOptions Init Options for the node
             */
            addNodeByType: function(nodeType, initOptions) {
                var newNode = GoNorth.DefaultNodeShapes.Serialize.getNodeSerializerInstance().createNewNode(nodeType, initOptions);
                if(newNode == null)
                {
                    this.errorOccured(true);
                    return;
                }

                this.nodeGraph().addCells(newNode);
                this.setupNewNode(newNode);
            },

            /**
             * Prepares a new node
             * 
             * @param {object} newNode New Node to setup
             */
            setupNewNode: function(newNode) {
                newNode.attr(".inPorts circle/magnet", "passive");
                
                var self = this;
                newNode.onDelete = function(node) {
                    return self.onDelete(node);
                };
            },

            /**
             * Reloads the fields for nodes
             * 
             * @param {string} id Id of the object for which to reload the nodes
             */
            reloadFieldsForNodes: function(objectType, id) {
                GoNorth.DefaultNodeShapes.Shapes.resetSharedObjectLoading(objectType, id);

                if(!this.nodeGraph())
                {
                    return;
                }

                var paper = this.nodePaper();
                var elements = this.nodeGraph().getElements();
                for(var curElement = 0; curElement < elements.length; ++curElement)
                {
                    var view = paper.findViewByModel(elements[curElement]);
                    if(view && view.reloadSharedLoadedData)
                    {
                        view.reloadSharedLoadedData(objectType, id);
                    }
                }
            },


            /**
             * Focuses a node if a node is specified in the url
             */
            focusNodeFromUrl: function() {
                var nodeId = GoNorth.Util.getParameterFromUrl("nodeFocusId");
                if(!nodeId)
                {
                    return;
                }

                GoNorth.Util.removeUrlParameter("nodeFocusId");
                var targetNode = this.nodeGraph().getCell(nodeId);
                if(!targetNode) 
                {
                    return;
                }

                var targetPosition = targetNode.position();
                var targetSize = targetNode.size();
                var paper = this.nodePaper();
                var viewBoundingBox;
                if(paper.el && paper.el.parentElement)
                {
                    viewBoundingBox = paper.el.parentElement.getBoundingClientRect()
                }
                else
                {
                    viewBoundingBox = paper.getContentBBox();
                }
                paper.translate(-targetPosition.x - targetSize.width * 0.5 + viewBoundingBox.width * 0.5, -targetPosition.y - targetSize.width * 0.5 + viewBoundingBox.height * 0.5);
            },


            /**
             * Delete Callback if a user wants to delete a node
             * 
             * @param {object} node Node to delete
             * @returns {jQuery.Deferred} Deferred that will be resolved if the user deletes the node
             */
            onDelete: function(node) {
                this.deleteLoading(false);
                this.deleteErrorOccured(false);
                this.deleteErrorAdditionalInformation("");
                this.showConfirmNodeDeleteDialog(true);

                this.deleteNodeTarget = node;
                this.deleteDeferred = new jQuery.Deferred();
                return this.deleteDeferred.promise();
            },

            /**
             * Deletes the node for which the dialog is opened
             */
            deleteNode: function() {
                if(!this.deleteNodeTarget || !this.deleteNodeTarget.validateDelete)
                {
                    this.resolveDeleteDeferred();
                }
                else
                {
                    var deleteDef = this.deleteNodeTarget.validateDelete();
                    if(!deleteDef)
                    {
                        this.resolveDeleteDeferred();
                    }
                    else
                    {
                        var self = this;
                        this.deleteLoading(true);
                        this.deleteErrorOccured(false);
                        this.deleteErrorAdditionalInformation(""); 
                        deleteDef.done(function() {
                            self.deleteLoading(false);
                            self.resolveDeleteDeferred();
                        }).fail(function(err) {
                            self.deleteLoading(false);
                            self.deleteErrorOccured(true);
                            self.deleteErrorAdditionalInformation(err); 
                        });
                    }
                }
            },

            /**
             * Resolves the delete deferred
             */
            resolveDeleteDeferred: function() {
                if(this.deleteDeferred)
                {
                    this.deleteDeferred.resolve();
                    this.deleteDeferred = null;
                }
                this.closeConfirmNodeDeleteDialog();
            },

            /**
             * Closes the confirm delete node dialog
             */
            closeConfirmNodeDeleteDialog: function() {
                if(this.deleteDeferred)
                {
                    this.deleteDeferred.reject();
                    this.deleteDeferred = null;
                }
                this.showConfirmNodeDeleteDialog(false);
                this.deleteLoading(false);
                this.deleteErrorOccured(false);
                this.deleteErrorAdditionalInformation("");
                this.deleteNodeTarget = null;
            },

            /**
             * Sets the graph to readonly mode
             */
            setGraphToReadonly: function() {
                jQuery(".gn-nodeGraphContainer").find("input,textarea,select").prop("disabled", true);
                jQuery(".gn-nodeGraphContainer").find(".joint-cell").css("pointer-events", "none");
                jQuery(".gn-nodeGraphContainer").find(".gn-nodeDeleteOnReadonly").remove();
                jQuery(".gn-nodeGraphContainer").find(".gn-nodeNonClickableOnReadonly").css("pointer-events", "none");
            }
        };

    }(GoNorth.DefaultNodeShapes = GoNorth.DefaultNodeShapes || {}));
}(window.GoNorth = window.GoNorth || {}));
(function(GoNorth) {
    "use strict";
    (function(Aika) {
        (function(Shared) {

            /**
             * Set the detail view id for new nodes
             * 
             * @param {object} nodeGraph Node Graph
             * @param {string} detailNodes Nodes with detail view ids
             */
            Shared.setDetailViewIds = function (nodeGraph, detailNodes) {
                if(!detailNodes)
                {
                    return;
                }

                var graphElements = nodeGraph.getElements();
                for(var curElement = 0; curElement < graphElements.length; ++curElement)
                {
                    var element = graphElements[curElement];
                    if(element.get("detailViewId"))
                    {
                        continue;
                    }

                    for(var curNode = 0; curNode < detailNodes.length; ++curNode)
                    {
                        if(element.id != detailNodes[curNode].id)
                        {
                            continue;
                        }

                        element.set("detailViewId", detailNodes[curNode].detailViewId);
                        break;
                    }
                }
            };

        }(Aika.Shared = Aika.Shared || {}));
    }(GoNorth.Aika = GoNorth.Aika || {}));
}(window.GoNorth = window.GoNorth || {}));
(function(GoNorth) {
    "use strict";
    (function(Aika) {
        (function(Shared) {

            
            /// Width for nodes which have finish nodes as outports
            Shared.finishNodeOutportNodeWidth = 250;

            /// Minimum Height for nodes which have finish nodes as outports
            Shared.finishNodeOutportNodeMinHeight = 150;

            /// Count of outports after which the node begins to grow
            var finishNodeOutportGrowStartCount = 3;

            /// Amount of pixel by which a node grows for each outports bigger than the grow start count
            var finishNodeOutportGrowHeight = 30;


            /**
             * Loads the detail view data
             * 
             * @param {object} chapterNode Chapter Node to fill
             * @param {string} detailViewId Id of the detail view
             * @returns {jQuery.Deferred} Deferred for the loading process
             */
            function loadDetailViewData(chapterNode, detailViewId) {
                var def = new jQuery.Deferred();

                // Load finish nodes
                chapterNode.showLoading();
                chapterNode.hideError();
                GoNorth.HttpClient.get("/api/AikaApi/GetChapterDetail?id=" + detailViewId).done(function(data) {
                    chapterNode.hideLoading();
                    
                    Shared.addFinishNodesAsOutports(chapterNode, data.finish);

                    def.resolve(data);
                }).fail(function(xhr) {
                    chapterNode.hideLoading();
                    chapterNode.showError();
                    def.reject();
                });

                return def.promise();
            }

            /**
             * Adds a finish nodes as outports for a node
             * @param {object} node Target node to which the outports should be added
             * @param {object[]} finishNodes Finish Nodes
             */
            Shared.addFinishNodesAsOutports = function(node, finishNodes)
            {
                if(!finishNodes)
                {
                    finishNodes = [];
                }

                var links = {};
                var allLinks = node.model.graph.getLinks();
                for(var curLink = 0; curLink < allLinks.length; ++curLink)
                {
                    var link = allLinks[curLink];
                    if(link.get("source") && link.get("source").id == node.model.id)
                    {
                        links[link.get("source").port] = link;
                    }
                }

                var outPorts = [];
                var portColors = {};
                for(var curFinish = 0; curFinish < finishNodes.length; ++curFinish)
                {
                    var portName = "finish" + finishNodes[curFinish].id; 
                    outPorts.push(portName);
                    portColors[portName] = finishNodes[curFinish].color;
                    var colorStyle = "fill: " + finishNodes[curFinish].color;
                    node.model.attr(".outPorts>.port" + curFinish + " circle", { "title": finishNodes[curFinish].name, "style": colorStyle });
                    node.model.attr(".outPorts>.port" + curFinish + " .port-label", { "title": finishNodes[curFinish].name, "class": "gn-aikaChapterFinishPort", "style": colorStyle, "dx": 13 });

                    if(links[portName])
                    {
                        links[portName].attr(".connection", { style: "stroke: " + finishNodes[curFinish].color });
                        links[portName].attr(".marker-target", { style: colorStyle });
                        delete links[portName];
                    }
                }
                node.model.set("outPorts", outPorts);

                var targetHeight = Shared.finishNodeOutportNodeMinHeight;
                if(outPorts.length > finishNodeOutportGrowStartCount)
                {
                    targetHeight = Shared.finishNodeOutportNodeMinHeight + (outPorts.length - finishNodeOutportGrowStartCount) * finishNodeOutportGrowHeight;
                }
                node.model.set("size", { width: Shared.finishNodeOutportNodeWidth, height: targetHeight });

                jQuery(".gn-aikaChapterFinishPort").each(function() {
                    jQuery(this).find("tspan").text(jQuery(this).attr("title"));
                });

                // Remove deleted port links
                for(var curPort in links)
                {
                    node.model.graph.removeCells([ links[curPort] ]);
                }

                // Handel add of new links
                node.model.graph.on('add', function(cell) {
                    if(!cell.isLink() || !cell.get("source"))
                    {
                        return;
                    }
                    
                    var source = cell.get("source");
                    if(source.id != node.model.id)
                    {
                        return;
                    }

                    if(portColors[source.port])
                    {
                        cell.attr(".connection", { style: "stroke: " + portColors[source.port] });
                        cell.attr(".marker-target", { style: "fill: " + portColors[source.port] });
                    }
                });
            }

            /**
             * Initializes the detail view connection
             * 
             * @param {object} chapterNode Chapter Node to fill
             * @param {string} detailViewId Id of the detail view
             * @returns {jQuery.Deferred} Deferred for the loading process
             */
            Shared.initDetailView = function (chapterNode, detailViewId) {
                if(chapterNode.$box.find(".gn-aikaChapterDetailButton").length > 0)
                {
                    return;
                }

                chapterNode.$box.append("<button class='gn-aikaChapterDetailButton'>" + Aika.Localization.Chapter.OpenDetailView + "</button>");

                chapterNode.$box.find(".gn-aikaChapterDetailButton").click(function() {
                    var detailWindow = window.open("/Aika/Detail?id=" + detailViewId);
                    detailWindow.refreshChapterNode = function() {
                        loadDetailViewData(chapterNode, detailViewId);
                    };
                });

                return loadDetailViewData(chapterNode, detailViewId);
            };

            /**
            * Checks if a chapter or chapter detail node can be deleted
            * 
            * @param {string} detailNodeId Detail Node id
            * @returns {jQuery.Deferred} Deferred for the validation process
            */
            Shared.validateChapterDetailDelete = function(detailNodeId) {
               if(!detailNodeId)
               {
                   return null;
               }

               var def = new jQuery.Deferred();
               GoNorth.HttpClient.get("/api/AikaApi/ValidateChapterDetailDelete?id=" + detailNodeId).done(function(data) {
                   if(data.canBeDeleted)
                   {
                       def.resolve();
                   }
                   else
                   {
                       def.reject(data.errorMessage);
                   }
               }).fail(function(xhr) {
                   def.reject("");
               });

               return def.promise();
           };

        }(Aika.Shared = Aika.Shared || {}));
    }(GoNorth.Aika = GoNorth.Aika || {}));
}(window.GoNorth = window.GoNorth || {}));
(function(GoNorth) {
    "use strict";
    (function(Aika) {
        (function(ChapterOverview) {

            /// Chapter Type
            var chapterType = "aika.Chapter";

            /// Chapter Target Array
            var chapterTargetArray = "chapter";

            joint.shapes.aika = joint.shapes.aika || {};

            /**
             * Creates the chapter shape
             * @returns {object} Chapter shape
             * @memberof ChapterOverview
             */
            function createChapterShape() {
                var model = joint.shapes.devs.Model.extend(
                {
                    defaults: joint.util.deepSupplement
                    (
                        {
                            type: chapterType,
                            icon: "glyphicon-king",
                            size: { width: Aika.Shared.finishNodeOutportNodeWidth, height: Aika.Shared.finishNodeOutportNodeMinHeight },
                            inPorts: ['input'],
                            outPorts: [],
                            attrs:
                            {
                                '.inPorts circle': { "magnet": "passive", "port-type": "input" },
                                '.outPorts circle': { "magnet": "true" } 
                            },
                            detailViewId: "",
                            chapterName: "",
                            chapterNumber: 1
                        },
                        joint.shapes.default.Base.prototype.defaults
                    )
                });
                return model;
            }

            /**
             * Creates a chapter view
             * @returns {object} Chapter view
             * @memberof ChapterOverview
             */
            function createChapterView()
            {
                return joint.shapes.default.BaseView.extend(
                {
                    /**
                     * Template
                     */
                    template:
                    [
                        '<div class="node">',
                            '<span class="label"><i class="nodeIcon glyphicon"></i><span class="labelText"></span></span>',
                            '<span class="gn-nodeLoading" style="display: none"><i class="glyphicon glyphicon-refresh spinning"></i></span>',
                            '<span class="gn-nodeError text-danger" style="display: none" title="' + GoNorth.DefaultNodeShapes.Localization.ErrorOccured + '"><i class="glyphicon glyphicon-warning-sign"></i></span>',
                            '<button class="delete gn-nodeDeleteOnReadonly cornerButton" title="' + GoNorth.DefaultNodeShapes.Localization.DeleteNode + '">x</button>',
                            '<input type="text" class="gn-aikaChapterName" placeholder="' + Aika.Localization.Chapter.ChapterName + '"/>',
                            '<input type="text" class="gn-aikaChapterNumber" placeholder="' + Aika.Localization.Chapter.ChapterNumber + '"/>',
                        '</div>',
                    ].join(''),

                    /**
                     * Initializes the shape
                     */
                    initialize: function() {
                        joint.shapes.default.BaseView.prototype.initialize.apply(this, arguments);

                        var self = this;

                        var chapterName = this.$box.find(".gn-aikaChapterName");
                        chapterName.on("input", function() {
                            self.model.set("chapterName", chapterName.val());
                        });
                        chapterName.val(this.model.get("chapterName"));

                        var chapterNumber = this.$box.find(".gn-aikaChapterNumber");
                        chapterNumber.on("change", function() {
                            var number = parseInt(chapterNumber.val());
                            if(isNaN(number))
                            {
                                number = 1;
                                chapterNumber.val(number);
                            }
                            self.model.set("chapterNumber", number);
                        });
                        chapterNumber.on("keydown", function(e) {
                            GoNorth.Util.validateNumberKeyPress(chapterNumber, e);
                        });
                        chapterNumber.val(this.model.get("chapterNumber"));

                        this.model.on('change:detailViewId', function() { Aika.Shared.initDetailView(self, self.model.get("detailViewId")) }, this);
                        if(this.model.get("detailViewId"))
                        {
                            Aika.Shared.initDetailView(this, this.model.get("detailViewId"));
                        }
                    },

                    /**
                     * Checks if a node can be deleted
                     * 
                     * @returns {jQuery.Deferred} Deferred for the validation process
                     */
                    validateDelete: function() {
                        return Aika.Shared.validateChapterDetailDelete(this.model.get("detailViewId"));
                    },


                    /**
                     * Shows the loading indicator
                     */
                    showLoading: function() {
                        this.$box.find(".gn-nodeLoading").show();
                    },

                    /**
                     * Hides the loading indicator
                     */
                    hideLoading: function() {
                        this.$box.find(".gn-nodeLoading").hide();
                    },


                    /**
                     * Shows the error indicator
                     */
                    showError: function() {
                        this.$box.find(".gn-nodeError").show();
                    },

                    /**
                     * Hides the error indicator
                     */
                    hideError: function() {
                        this.$box.find(".gn-nodeError").hide();
                    }
                });
            }

            /**
             * Chapter Shape
             */
            joint.shapes.aika.Chapter = createChapterShape();

            /**
             * Chapter View
             */
            joint.shapes.aika.ChapterView = createChapterView();


            /** 
             * Chapter Serializer 
             * 
             * @class
             */
            ChapterOverview.ChapterSerializer = function()
            {
                GoNorth.DefaultNodeShapes.Serialize.BaseNodeSerializer.apply(this, [joint.shapes.aika.Chapter, chapterType, chapterTargetArray ]);
            };

            ChapterOverview.ChapterSerializer.prototype = jQuery.extend({ }, GoNorth.DefaultNodeShapes.Serialize.BaseNodeSerializer.prototype)

            /**
             * Serializes a node
             * 
             * @param {object} node Node Object
             * @returns {object} Serialized NOde
             */
            ChapterOverview.ChapterSerializer.prototype.serialize = function(node) 
            {
                var serializedData = {
                    id: node.id,
                    x: node.position.x,
                    y: node.position.y,
                    detailViewId: node.detailViewId,
                    name: node.chapterName,
                    chapterNumber: node.chapterNumber
                };

                return serializedData;
            };

            /**
             * Deserializes a serialized node
             * 
             * @param {object} node Serialized Node Object
             * @returns {object} Deserialized Node
             */
            ChapterOverview.ChapterSerializer.prototype.deserialize = function(node) 
            {
                var initOptions = {
                    id: node.id,
                    position: { x: node.x, y: node.y },
                    detailViewId: node.detailViewId,
                    chapterName: node.name,
                    chapterNumber: node.chapterNumber
                };

                var node = new this.classType(initOptions);
                return node;
            };

            // Register Serializers
            var chapterSerializer = new ChapterOverview.ChapterSerializer();
            GoNorth.DefaultNodeShapes.Serialize.getNodeSerializerInstance().addNodeSerializer(chapterSerializer);

        }(Aika.ChapterOverview = Aika.ChapterOverview || {}));
    }(GoNorth.Aika = GoNorth.Aika || {}));
}(window.GoNorth = window.GoNorth || {}));
(function(GoNorth) {
    "use strict";
    (function(Aika) {
        (function(ChapterOverview) {

            /**
             * Chapter Overview View Model
             * @class
             */
            ChapterOverview.ViewModel = function()
            {
                GoNorth.DefaultNodeShapes.BaseViewModel.apply(this);

                this.id = new ko.observable("");

                this.isLoading = new ko.observable(false);
                this.isReadonly = new ko.observable(false);
                this.lockedByUser = new ko.observable("");
            
                this.additionalErrorDetails = new ko.observable("");

                // Dirty Check
                var self = this;
                this.dirtyChecker = new GoNorth.SaveUtil.DirtyChecker(function() {
                    return self.buildSaveRequestObject();
                }, GoNorth.Aika.Shared.DirtyMessage, GoNorth.Aika.Shared.disableAutoSaving, function() {
                    self.save();
                });

                GoNorth.SaveUtil.setupSaveHotkey(function() {
                    self.save();
                });

                this.load();
            };

            ChapterOverview.ViewModel.prototype = jQuery.extend({ }, GoNorth.DefaultNodeShapes.BaseViewModel.prototype);

            /**
             * Builds the save request object
             * @returns {object} Save request object
             */
             ChapterOverview.ViewModel.prototype.buildSaveRequestObject = function() {
                return GoNorth.DefaultNodeShapes.Serialize.getNodeSerializerInstance().serializeGraph(this.nodeGraph());
            };

            /**
             * Saves the chapter overview
             */
            ChapterOverview.ViewModel.prototype.save = function() {
                if(!this.nodeGraph())
                {
                    return;
                }

                var serializedGraph = this.buildSaveRequestObject();

                this.isLoading(true);
                this.errorOccured(false);
                var self = this;
                GoNorth.HttpClient.post("/api/AikaApi/SaveChapterOverview", serializedGraph).done(function(data) {
                    Aika.Shared.setDetailViewIds(self.nodeGraph(), data.chapter);

                    if(!self.id())
                    {
                        self.id(data.id);
                        self.acquireLock();
                    }

                    self.dirtyChecker.saveCurrentSnapshot();

                    self.isLoading(false);
                }).fail(function(xhr) {
                    self.isLoading(false);
                    self.errorOccured(true);

                    // If object is related to anything that prevents deleting a bad request (400) will be returned
                    if(xhr.status == 400 && xhr.responseText)
                    {
                        self.additionalErrorDetails(xhr.responseText);
                    }
                });
            };

            /**
             * Loads the data
             */
            ChapterOverview.ViewModel.prototype.load = function() {
                this.isLoading(true);
                this.errorOccured(false);
                var self = this;
                GoNorth.HttpClient.get("/api/AikaApi/GetChapterOverview").done(function(data) {
                    self.isLoading(false);

                    // Only deserialize data if a chapter overview already exists, will be null before someone saves it
                    if(data)
                    {
                        self.id(data.id);
                        self.acquireLock();

                        GoNorth.DefaultNodeShapes.Serialize.getNodeSerializerInstance().deserializeGraph(self.nodeGraph(), data, function(newNode) { self.setupNewNode(newNode); });

                        if(self.isReadonly())
                        {
                            self.setGraphToReadonly();
                        }
                    }
                    
                    self.dirtyChecker.saveCurrentSnapshot();
                }).fail(function(xhr) {
                    self.isLoading(false);
                    self.errorOccured(true);
                });
            };


            /**
             * Acquires a lock
             */
            ChapterOverview.ViewModel.prototype.acquireLock = function() {
                this.lockedByUser("");
                this.isReadonly(false);

                var self = this;
                GoNorth.LockService.acquireLock("ChapterOverview", this.id()).done(function(isLocked, lockedUsername) { 
                    if(isLocked)
                    {
                        self.isReadonly(true);
                        self.lockedByUser(lockedUsername);
                        self.setGraphToReadonly();
                    }
                }).fail(function() {
                    self.errorOccured(true);
                });
            };


            /**
             * Opens the quest list
             */
            ChapterOverview.ViewModel.prototype.openQuestList = function() {
                window.location = "/Aika/QuestList";
            };

        }(Aika.ChapterOverview = Aika.ChapterOverview || {}));
    }(GoNorth.Aika = GoNorth.Aika || {}));
}(window.GoNorth = window.GoNorth || {}));