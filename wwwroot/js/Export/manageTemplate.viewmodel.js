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
    (function(BindingHandlers) {

        if(typeof ko !== "undefined")
        {

            /**
             * Code Editor Binding Handler
             */
            ko.bindingHandlers.codeEditor = {
                init: function (element, valueAccessor, allBindings) {
                    ace.require("ace/ext/language_tools");

                    var obs = valueAccessor();

                    // Read Config Values
                    var theme = null;
                    if(allBindings.get("codeEditorTheme"))
                    {
                        theme = ko.unwrap(allBindings.get("codeEditorTheme"));
                    }

                    if(!theme)
                    {
                        theme = "ace/theme/monokai";
                    }

                    var mode = null;
                    if(allBindings.get("codeEditorMode"))
                    {
                        mode = ko.unwrap(allBindings.get("codeEditorMode"));
                    }

                    if(!mode)
                    {
                        mode = "ace/mode/lua";
                    }

                    obs._editor = ace.edit(element, {
                        useWorker: false
                    });
                    obs._editor.setTheme(theme);
                    obs._editor.session.setMode(mode);
                    obs._editor.setOptions({
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true
                    });

                    // Ensure autocomplete is triggered on dot
                    obs._editor.commands.on("afterExec", function (e) {
                        if ((e.command.name == "insertstring" && /^[\w.]$/.test(e.args)) || e.command.name == "backspace") {
                            obs._editor.execCommand("startAutocomplete");
                        }
                    });

                    if(ko.isObservable(obs))
                    {
                        obs._editor.session.on('change', function(delta) {
                            obs._blockUpdate = true;
                            try
                            {
                                obs(obs._editor.getValue());
                                obs._blockUpdate = false;
                            }
                            catch(e)
                            {
                                obs._blockUpdate = false;
                            }
                        });
                    }
                },
                update: function (element, valueAccessor, allBindings) {
                    var obs = valueAccessor();
                    var blockUpdate = obs._blockUpdate;
                    var value = obs;
                    if(ko.isObservable(value))
                    {
                        value = value();
                    }

                    var isReadonly = allBindings.get("codeEditorReadonly");
                    if(isReadonly)
                    {
                        isReadonly = ko.unwrap(isReadonly);
                        obs._editor.setReadOnly(isReadonly);
                    }

                    if(!blockUpdate)
                    {
                        obs._editor.session.setValue(value);
                    }
                }
            }

        }

    }(GoNorth.BindingHandlers = GoNorth.BindingHandlers || {}));
}(window.GoNorth = window.GoNorth || {}));
(function(GoNorth) {
    "use strict";
    (function(Export) {
        (function(ManageTemplate) {

            /**
             * Supported rendering engines
             */
            var renderingEngines = {
                legacy: "Legacy",
                scriban: "Scriban"
            }

            /**
             * Character Width for calculating the character width
             */
            var autoCompleteCharWidth = 8;

            /**
             * Min Width for the autocomplete width
             */
            var autoCompleteMinWidth = 300;

            /**
             * Manage Template View Model
             * @class
             */
            ManageTemplate.ViewModel = function()
            {
                this.templateType = GoNorth.Util.getParameterFromUrl("templateType");
                this.customizedObjectId = new ko.observable("");
                var customizedObjectId = GoNorth.Util.getParameterFromUrl("customizedObjectId");
                if(customizedObjectId)
                {
                    this.customizedObjectId(customizedObjectId);
                }
                this.customizedObjectIsTemplate = new ko.observable(false);
                if(GoNorth.Util.getParameterFromUrl("objectIsTemplate"))
                {
                    this.customizedObjectIsTemplate(true);
                }

                this.templateLabel = new ko.observable("");
                this.templateCode = new ko.observable("");

                this.arePlaceholdersExpanded = new ko.observable(false);
                this.templatePlaceholders = new ko.observableArray();
                this.placeholderLookupTree = {};

                this.customizedObjectTemplateIsDefault = new ko.observable(false);
                this.parentTemplateId = new ko.observable("");
                this.parentTemplateUrl = new ko.computed(function() {
                    var url = "/Export/ManageTemplate?templateType=" + this.templateType;
                    if(this.parentTemplateId())
                    {
                        url += "&customizedObjectId=" + this.parentTemplateId() + "&objectIsTemplate=1"; // Parent customized object is always a template
                    }
                    return url;
                }, this);

                this.customizedChildTemplates = new ko.observableArray();

                this.objectWithInvalidSnippets = new ko.observableArray([]);

                this.showConfirmTemplateDeleteDialog = new ko.observable(false);

                this.templateRenderingEngine = new ko.observable(renderingEngines.scriban);
                this.legacyRenderingEngine = renderingEngines.legacy;

                this.isLoading = new ko.observable(false);
                this.isLoadingPlaceholders = new ko.observable(false);
                this.errorOccured = new ko.observable(false);
                this.additionalError = new ko.observable(null);
                this.isReadonly = new ko.observable(false);
                this.lockedByUser = new ko.observable("");

                this.setupAutoComplete();

                if(this.templateType)
                {
                    this.loadInvalidSnippets();
                    this.initTemplateData();
                }
                else
                {
                    this.errorOccured(true);
                }

                var self = this;
                GoNorth.Util.onUrlParameterChanged(function() {
                    var customizedObjectId = GoNorth.Util.getParameterFromUrl("customizedObjectId");
                    if(customizedObjectId)
                    {
                        self.customizedObjectId(customizedObjectId);
                    }
                    else
                    {
                        self.customizedObjectId("");
                    }
                    if(GoNorth.Util.getParameterFromUrl("objectIsTemplate"))
                    {
                        self.customizedObjectIsTemplate(true);
                    }
                    else
                    {
                        self.customizedObjectIsTemplate(false);
                    }

                    GoNorth.LockService.releaseCurrentLock();
                    self.initTemplateData();
                });

                // Dirty Check
                this.dirtyChecker = new GoNorth.SaveUtil.DirtyChecker(function() {
                    return self.buildSaveRequestObject();
                }, GoNorth.Export.ManageTemplate.DirtyMessage, GoNorth.Export.ManageTemplate.disableAutoSaving, function() {
                    self.save();
                });

                GoNorth.SaveUtil.setupSaveHotkey(function() {
                    self.save();
                });
            };

            ManageTemplate.ViewModel.prototype = {
                /**
                 * Resets the error state
                 */
                resetErrorState: function() {
                    this.errorOccured(false);
                    this.additionalError(null);
                },

                /**
                 * Initializes the template data
                 */
                initTemplateData: function() {
                    this.acquireLock();
                    this.loadDefaultTemplateData();
                },

                /**
                 * Loads the default template data
                 */
                loadDefaultTemplateData: function() {
                    var url = "/api/ExportApi/GetDefaultTemplateByType?templateType=" + this.templateType;
                    if(this.customizedObjectId())
                    {
                        url = "/api/ExportApi/GetExportTemplateByObjectId?id=" + this.customizedObjectId() + "&templateType=" + this.templateType;
                    }

                    this.isLoading(true);
                    this.resetErrorState();
                    var self = this;
                    GoNorth.HttpClient.get(url).done(function(template) {
                        self.isLoading(false);
                        if(self.customizedObjectId())
                        {
                            self.customizedObjectTemplateIsDefault(template.isDefaultCode);
                            self.parentTemplateId(template.exportTemplate.template.customizedObjectId);
                            template = template.exportTemplate;

                            if(!template.isDefaultCode)
                            {
                                self.loadChildCustomizedTemplates();
                            }
                        }
                        else
                        {
                            self.customizedObjectTemplateIsDefault(false);
                            self.loadChildCustomizedTemplates();
                        }
                        self.templateLabel(template.label);
                        self.templateRenderingEngine(template.template.renderingEngine);
                        self.templateCode(template.template.code);
                        
                        self.loadTemplatePlaceholders();

                        self.dirtyChecker.saveCurrentSnapshot();
                    }).fail(function() {
                        self.isLoading(false);
                        self.errorOccured(true);
                    });
                },

                /**
                 * Loads the template placeholders
                 */
                loadTemplatePlaceholders: function() {
                    this.isLoadingPlaceholders(true);
                    var self = this;
                    GoNorth.HttpClient.get("/api/ExportApi/GetTemplatePlaceholders?templateType=" + this.templateType + "&renderingEngine=" + this.templateRenderingEngine()).done(function(placeholders) {
                        self.templatePlaceholders(placeholders);
                        self.prepareTemplateAutoCompleteLookupTree(placeholders);
                        self.isLoadingPlaceholders(false);
                    }).fail(function() {
                        self.isLoadingPlaceholders(false);
                        self.errorOccured(true);
                    });
                },

                /**
                 * Builds the save request object
                 * @returns {object} Save request object
                 */
                buildSaveRequestObject: function() {
                    return this.templateCode();
                },

                /**
                 * Saves the template
                 */
                save: function() {
                    var url = "/api/ExportApi/SaveDefaultExportTemplate?templateType=" + this.templateType + "&renderingEngine=" + this.templateRenderingEngine();
                    if(this.customizedObjectId())
                    {
                        url = "/api/ExportApi/SaveExportTemplateByObjectId?id=" + this.customizedObjectId() + "&templateType=" + this.templateType + "&renderingEngine=" + this.templateRenderingEngine();
                    }

                    this.isLoading(true);
                    this.resetErrorState();
                    var self = this;
                    GoNorth.HttpClient.post(url, this.buildSaveRequestObject()).done(function() {
                        self.customizedObjectTemplateIsDefault(false);
                        self.isLoading(false);

                        self.loadInvalidSnippets();
                        
                        self.dirtyChecker.saveCurrentSnapshot();
                    }).fail(function(xhr) {
                        self.isLoading(false);
                        self.errorOccured(true);

                        // If there are template errors a bad request (400) will be returned
                        if(xhr.status == 400 && xhr.responseJSON)
                        {
                            self.additionalError(xhr.responseJSON);
                        }
                    });
                },


                /**
                 * Toggles the placeholder visibility
                 */
                tooglePlaceholderVisibility: function() {
                    this.arePlaceholdersExpanded(!this.arePlaceholdersExpanded());
                },

                
                /**
                 * Opens the delete template dialog
                 */
                openDeleteTemplateDialog: function() {
                    this.showConfirmTemplateDeleteDialog(true);
                },

                /**
                 * Closes the delete template dialog
                 */
                closeDeleteTemplateDialog: function() {
                    this.showConfirmTemplateDeleteDialog(false);
                },

                /**
                 * Deletes the template
                 */
                deleteTemplate: function() {
                    if(!this.customizedObjectId())
                    {
                        return;
                    }

                    this.isLoading(true);
                    this.resetErrorState();
                    var self = this;
                    GoNorth.HttpClient.delete("/api/ExportApi/DeleteExportTemplateByObjectId?id=" + this.customizedObjectId()).done(function(data) {
                        self.closeDeleteTemplateDialog();
                        self.redirectToObjectPage();
                    }).fail(function(xhr) {
                        self.isLoading(false);
                        self.errorOccured(true);
                        self.closeDeleteTemplateDialog();
                    });
                },

                /**
                 * Redirects back to object page
                 */
                redirectToObjectPage: function() {
                    if(!GoNorth.Export.ManageTemplate.templateTypeMapping[this.templateType])
                    {
                        window.location = "/Export";
                    }

                    var targetUrl = GoNorth.Export.ManageTemplate.templateTypeMapping[this.templateType].replace("{0}", this.customizedObjectId());
                    if(this.customizedObjectIsTemplate())
                    {
                        targetUrl += "&template=1";
                    }
                    window.location = targetUrl;
                },


                /**
                 * Loads child export templates that are based on the template but use a customized template
                 */
                loadChildCustomizedTemplates: function() {
                    var url = "/api/ExportApi/GetCustomizedTemplatesByType?templateType=" + this.templateType;
                    if(this.customizedObjectId())
                    {
                        url = "/api/ExportApi/GetCustomizedTemplatesByParentObject?customizedObjectId=" + this.customizedObjectId() + "&templateType=" + this.templateType;
                    }

                    this.isLoading(true);
                    this.resetErrorState();
                    var self = this;
                    GoNorth.HttpClient.get(url).done(function(data) {
                        self.customizedChildTemplates(data);
                        self.isLoading(false);
                    }).fail(function() {
                        self.isLoading(false);
                        self.errorOccured(true);
                    });
                },

                /**
                 * Builds a child template url
                 * @param {object} childTemplate Child Template
                 * @returns {string} Url for the child template
                 */
                buildChildTemplateUrl: function(childTemplate) {
                    if(!GoNorth.Export.ManageTemplate.templateTypeMapping[this.templateType])
                    {
                        return "";
                    }

                    var targetUrl = GoNorth.Export.ManageTemplate.templateTypeMapping[this.templateType].replace("{0}", childTemplate.objectId);
                    if(childTemplate.isObjectTemplate)
                    {
                        targetUrl += "&template=1";
                    }
                    return targetUrl;
                },


                /**
                 * Converst the current template to a modern template
                 */
                convertToModernTemplate: function() {
                    this.templateRenderingEngine(renderingEngines.scriban);
                    this.loadTemplatePlaceholders();
                },


                /**
                 * Loads all invalid snippets based on the template
                 */
                loadInvalidSnippets: function() {
                    if(!GoNorth.Export.ManageTemplate.templateTypeMapping[this.templateType])
                    {
                        return;
                    }

                    var url = "/api/ExportApi/GetObjectsWithInvalidSnippets?templateType=" + this.templateType;
                    if(this.customizedObjectId())
                    {
                        url += "&id=" + this.customizedObjectId();
                    }
                    var self = this;
                    GoNorth.HttpClient.get(url).done(function(data) {
                        self.objectWithInvalidSnippets(data);
                    }).fail(function() {
                        self.errorOccured(true);
                    });
                },
                
                /**
                 * Prepares the template placeholders for the autocompletion
                 * @param {object[]} placeholders Loaded placeholders
                 */
                prepareTemplateAutoCompleteLookupTree: function(placeholders) {
                    this.placeholderLookupTree = {};
                    if(!placeholders)
                    {
                        return;
                    }

                    for(var curPlaceholder = 0; curPlaceholder < placeholders.length; ++curPlaceholder)
                    {
                        if(placeholders[curPlaceholder].ignoreForAutocomplete || placeholders[curPlaceholder].name.indexOf(" ") >= 0)
                        {
                            continue;
                        }

                        var placeholderName = placeholders[curPlaceholder].name.replace(/<.*?>$/i, "").trim();

                        var splittedKey = placeholderName.split(".");
                        var currentParentObject = this.placeholderLookupTree;
                        var currentRefObject = this.placeholderLookupTree;
                        for(var curKeyPart = 0; curKeyPart < splittedKey.length; ++curKeyPart)
                        {
                            var objectKey = splittedKey[curKeyPart].toLowerCase();
                            var isPlaceholderPart = /^<.*>$/.test(objectKey);
                            if(!currentParentObject[objectKey])
                            {
                                currentParentObject[objectKey] = {
                                    originalKey: splittedKey[curKeyPart],
                                    isPlaceholderPart: isPlaceholderPart,
                                    anyPlaceholderChild: null,
                                    children: {}
                                };

                                if(isPlaceholderPart)
                                {
                                    currentRefObject.anyPlaceholderChild = currentParentObject[objectKey];
                                }
                            }

                            currentRefObject = currentParentObject[objectKey];
                            currentParentObject = currentParentObject[objectKey].children;
                        }
                    }
                },

                /**
                 * Initializes the auto complete tool
                 */
                setupAutoComplete: function() {
                    var self = this;
                    var langTools = ace.require("ace/ext/language_tools");
                    var autoCompleter = {
                        identifierRegexps: [/[^\s]+/],
                        getCompletions: function(editor, session, pos, prefix, callback) {
                            var splittedPrefix = prefix.split(".");
                            var prefixes = "";
                            var currentParentObject = self.placeholderLookupTree;
                            var currentAnyPlaceholderChild = self.placeholderLookupTree.anyPlaceholderChild;
                            var endsWithUnknown = false;
                            for(var curKeyPart = 0; curKeyPart < splittedPrefix.length; ++curKeyPart)
                            {
                                var objectKey = splittedPrefix[curKeyPart].toLowerCase();
                                if(currentParentObject[objectKey])
                                {
                                    if(prefixes) 
                                    {
                                        prefixes += ".";
                                    }
                                    prefixes += currentParentObject[objectKey].originalKey;
                                    currentAnyPlaceholderChild = currentParentObject[objectKey].anyPlaceholderChild;
                                    currentParentObject = currentParentObject[objectKey].children;
                                }
                                else if(currentAnyPlaceholderChild && objectKey)
                                {
                                    if(prefixes) 
                                    {
                                        prefixes += ".";
                                    }
                                    prefixes += splittedPrefix[curKeyPart];
                                    var originalAnyPlaceholderChild = currentAnyPlaceholderChild;
                                    currentAnyPlaceholderChild = originalAnyPlaceholderChild.anyPlaceholderChild;
                                    currentParentObject = originalAnyPlaceholderChild.children;
                                }
                                else
                                {
                                    endsWithUnknown = true;
                                    break;
                                }
                            }

                            if(prefixes)
                            {
                                prefixes += ".";
                            }
                            var placeholders = [];
                            var maxKeyLength = 0;
                            for(var curKey in currentParentObject)
                            {
                                let currentKey = currentParentObject[curKey].originalKey;
                                if(currentParentObject[curKey].isPlaceholderPart && endsWithUnknown)
                                {
                                    currentKey = splittedPrefix[splittedPrefix.length - 1] + " ";
                                }
                                currentKey = prefixes + currentKey;
                                maxKeyLength = Math.max(maxKeyLength, currentKey.length)

                                placeholders.push({
                                    caption: currentKey,
                                    value: currentKey,
                                    meta: "placeholder",
                                    score: 300
                                });
                            }

                            var textWidth = maxKeyLength * autoCompleteCharWidth;
                            if(textWidth < 300)
                            {
                                textWidth = autoCompleteMinWidth;
                            }

                            if(editor.completer && editor.completer.popup)
                            {
                                var popup = editor.completer.popup; 
                                popup.container.style.width = textWidth + "px"; 
                                popup.resize();
                            }

                            callback(
                                null,
                                placeholders
                            );
                        }
                    }
                    
                    langTools.addCompleter(autoCompleter);
                },


                /**
                 * Acquires a lock
                 */
                acquireLock: function() {
                    var self = this;
                    var appendProjectId = true;
                    var lockId = this.templateType;
                    if(this.customizedObjectId())
                    {
                        appendProjectId = false;
                        lockId = this.customizedObjectId();
                    }
                    GoNorth.LockService.acquireLock("ExportTemplate", lockId, appendProjectId).done(function(isLocked, lockedUsername) { 
                        if(isLocked)
                        {
                            self.isReadonly(true);
                            self.lockedByUser(lockedUsername);
                        }
                    }).fail(function() {
                        self.errorOccured(true);
                        self.isReadonly(true);
                    });
                }
            };

        }(Export.ManageTemplate = Export.ManageTemplate || {}));
    }(GoNorth.Export = GoNorth.Export || {}));
}(window.GoNorth = window.GoNorth || {}));