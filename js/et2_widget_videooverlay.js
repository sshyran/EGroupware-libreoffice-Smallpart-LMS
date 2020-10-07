"use strict";
/**
 * EGroupware SmallPART - Videooverlay
 *
 * @license http://opensource.org/licenses/gpl-license.php GPL - GNU General Public License
 * @package smallpart
 * @subpackage ui
 * @link https://www.egroupware.org
 * @author Ralf Becker <rb@egroupware.org>
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/*egw:uses
    et2_core_baseWidget;
*/
var et2_core_baseWidget_1 = require("../../api/js/etemplate/et2_core_baseWidget");
var et2_core_widget_1 = require("../../api/js/etemplate/et2_core_widget");
var et2_core_inheritance_1 = require("../../api/js/etemplate/et2_core_inheritance");
var et2_widget_description_1 = require("../../api/js/etemplate/et2_widget_description");
var et2_widget_videobar_1 = require("./et2_widget_videobar");
var et2_widget_button_1 = require("../../api/js/etemplate/et2_widget_button");
var et2_widget_dropdown_button_1 = require("../../api/js/etemplate/et2_widget_dropdown_button");
var et2_widget_number_1 = require("../../api/js/etemplate/et2_widget_number");
var et2_widget_htmlarea_1 = require("../../api/js/etemplate/et2_widget_htmlarea");
/**
 * Videooverlay shows time-synchronious to the video various overlay-elements
 *
 * Overlay-elements have a starttime they get created by this overlay widget as it's children.
 * The overlay widgets informs the elements / it's children if user seeks the video, so they
 * can decide, if they should still be shown or removed by the overlay widget.
 *
 * Overlay-elements have a player_mode attribute telling the overlay widget to eg. stop playing the video
 * and/or disable certain player controls to eg. require the user to answer a question.
 *
 * Overlay-elements can call their parent to get themselfs removed, if they are done eg. user
 * answered a question or the duration of a headline is exceeded.
 *
 * @augments et2_baseWidget
 */
var et2_smallpart_videooverlay = /** @class */ (function (_super) {
    __extends(et2_smallpart_videooverlay, _super);
    /**
     * Constructor
     */
    function et2_smallpart_videooverlay(_parent, _attrs, _child) {
        var _this = 
        // Call the inherited constructor
        _super.call(this, _parent, _attrs, et2_core_inheritance_1.ClassWithAttributes.extendAttributes(et2_smallpart_videooverlay._attributes, _child || {})) || this;
        _this._elementsContainer = null;
        _this.add = null;
        _this._editor = null;
        _this.div = jQuery(document.createElement("div"))
            .addClass("et2_" + _this.getType());
        _this._elementsContainer = et2_core_widget_1.et2_createWidget('hbox', { width: "100%", height: "100%", class: "elementsContainer" }, _this);
        _this.setDOMNode(_this.div[0]);
        return _this;
    }
    /**
     * Set video ID
     *
     * @param _id
     */
    et2_smallpart_videooverlay.prototype.set_video_id = function (_id) {
        if (_id === this.video_id)
            return;
        this.iterateOver(function (_widget) {
            _widget.destroy();
            this.removeChild(_widget);
        }.bind(this), this, et2_IOverlayElement);
        this.elements = [];
        this.video_id = _id;
        this.fetchElements(0);
    };
    /**
     * Setter for course_id
     *
     * @param _id
     */
    et2_smallpart_videooverlay.prototype.set_course_id = function (_id) {
        this.course_id = _id;
    };
    /**
     * Set videobar to use
     *
     * @param _id_or_widget
     */
    et2_smallpart_videooverlay.prototype.set_videobar = function (_id_or_widget) {
        if (typeof _id_or_widget === 'string') {
            _id_or_widget = this.getRoot().getWidgetById(_id_or_widget);
        }
        if (_id_or_widget instanceof et2_widget_videobar_1.et2_smallpart_videobar) {
            this.videobar = _id_or_widget;
        }
    };
    /**
     *
     * @param _id_or_widget
     */
    et2_smallpart_videooverlay.prototype.set_toolbar_save = function (_id_or_widget) {
        if (typeof _id_or_widget === 'string') {
            _id_or_widget = this.getRoot().getWidgetById(_id_or_widget);
        }
        if (_id_or_widget instanceof et2_widget_button_1.et2_button) {
            this.toolbar_save = _id_or_widget;
            this.toolbar_save.onclick = jQuery.proxy(function () {
                this._enable_toolbar_edit_mode(false, false);
                //TODO: save callback to send the data to server
                this.editor.onSaveCallback({
                    'video_id': this.video_id,
                    'overlay_duration': this.toolbar_duration.getValue(),
                    'overlay_starttime': this.toolbar_starttime.getType(),
                    'videobar': this.videobar
                });
                this._editor.destroy();
            }, this);
        }
    };
    et2_smallpart_videooverlay.prototype.set_toolbar_edit = function (_id_or_widget) {
        if (typeof _id_or_widget === 'string') {
            _id_or_widget = this.getRoot().getWidgetById(_id_or_widget);
        }
        if (_id_or_widget instanceof et2_widget_button_1.et2_button) {
            this.toolbar_edit = _id_or_widget;
            this.toolbar_edit.onclick = jQuery.proxy(function () {
                this._enable_toolbar_edit_mode(true, true);
            }, this);
        }
    };
    et2_smallpart_videooverlay.prototype._enable_toolbar_edit_mode = function (_state, _deleteEnabled) {
        this.toolbar_edit.set_disabled(true);
        if (_state) {
            this.toolbar_starttime.set_value(Math.floor(this.videobar.video[0].currentTime));
            this.toolbar_duration.set_max(Math.floor(this.videobar.video[0].duration - this.toolbar_starttime.getValue()));
        }
        this.toolbar_save.set_disabled(!_state);
        this.toolbar_delete.set_disabled(!(_state && _deleteEnabled));
        this.toolbar_add.set_disabled(_state);
        this.toolbar_duration.set_disabled(!_state);
        this.toolbar_starttime.set_disabled(!_state);
        this.toolbar_cancel.set_disabled(!_state);
        this.toolbar_starttime.set_readonly(true);
    };
    et2_smallpart_videooverlay.prototype.set_toolbar_cancel = function (_id_or_widget) {
        if (typeof _id_or_widget === 'string') {
            _id_or_widget = this.getRoot().getWidgetById(_id_or_widget);
        }
        if (_id_or_widget instanceof et2_widget_button_1.et2_button) {
            this.toolbar_cancel = _id_or_widget;
            this.toolbar_cancel.onclick = jQuery.proxy(function () {
                this._enable_toolbar_edit_mode(false, false);
                this._editor.destroy();
            }, this);
        }
    };
    et2_smallpart_videooverlay.prototype.set_toolbar_delete = function (_id_or_widget) {
        if (typeof _id_or_widget === 'string') {
            _id_or_widget = this.getRoot().getWidgetById(_id_or_widget);
        }
        if (_id_or_widget instanceof et2_widget_button_1.et2_button) {
            this.toolbar_delete = _id_or_widget;
            this.toolbar_delete.onclick = jQuery.proxy(function () {
                this._enable_toolbar_edit_mode(false);
                this._editor.destroy();
            }, this);
        }
    };
    et2_smallpart_videooverlay.prototype.set_toolbar_starttime = function (_id_or_widget) {
        if (typeof _id_or_widget === 'string') {
            _id_or_widget = this.getRoot().getWidgetById(_id_or_widget);
        }
        if (_id_or_widget instanceof et2_widget_number_1.et2_number) {
            this.toolbar_starttime = _id_or_widget;
            this.toolbar_starttime.set_min(0);
            this.toolbar_starttime.set_max(this.videobar.video[0].duration);
            this.toolbar_starttime.set_value(this.videobar.video[0].currentTime);
        }
    };
    et2_smallpart_videooverlay.prototype.set_toolbar_duration = function (_id_or_widget) {
        if (typeof _id_or_widget === 'string') {
            _id_or_widget = this.getRoot().getWidgetById(_id_or_widget);
        }
        if (_id_or_widget instanceof et2_widget_number_1.et2_number) {
            this.toolbar_duration = _id_or_widget;
            this.toolbar_duration.set_min(0);
            this.videobar.video[0].addEventListener("loadedmetadata", jQuery.proxy(function () {
                this.toolbar_duration.set_max(this.videobar.video[0].duration - this.toolbar_starttime.getValue());
            }, this));
        }
    };
    et2_smallpart_videooverlay.prototype.set_toolbar_add = function (_id_or_widget) {
        if (typeof _id_or_widget === 'string') {
            _id_or_widget = this.getRoot().getWidgetById(_id_or_widget);
        }
        if (_id_or_widget instanceof et2_widget_dropdown_button_1.et2_dropdown_button) {
            this.toolbar_add = _id_or_widget;
            //TODO: set select options with available plugins
            this.toolbar_add.set_select_options([{ "et2_smallpart_overlay_html": "html" }]);
            this.toolbar_add.onchange = jQuery.proxy(function (_node, _widget) {
                this._enable_toolbar_edit_mode(true, false);
                this.toolbar_duration.set_value(0);
                switch (_widget.getValue()) {
                    case "et2_smallpart_overlay_html":
                        this._editor = et2_core_widget_1.et2_createWidget('smallpart-overlay-html', {
                            width: "100%",
                            height: "100%",
                            class: "smallpart-overlay-element",
                            mode: "simple"
                        }, this._elementsContainer);
                        this._editor.toolbar = "";
                        this._editor.doLoadingFinished();
                }
            }, this);
        }
    };
    /**
     * Load overlay elements from server
     *
     * @param _start
     * @return Promise
     */
    et2_smallpart_videooverlay.prototype.fetchElements = function (_start) {
        if (!_start) {
            this.elements = [];
            this.total = 0;
        }
        if (!this.get_elements_callback)
            return;
        // fetch first chunk of overlay elements
        return this.egw().json(this.get_elements_callback, [{
                video_id: this.video_id,
                course_id: this.course_id,
            }, _start], function (_data) {
            var _a;
            if (typeof _data === 'object' && Array.isArray(_data.elements)) {
                (_a = this.elements).concat.apply(_a, _data.elements);
                this.total = _data.total;
            }
        }.bind(this)).sendRequest();
    };
    /**
     * Called when video is seeked to a certain position to create and remove elements
     *
     * Every running element / child is asked if it want's to keep running.
     *
     * @param number _time
     */
    et2_smallpart_videooverlay.prototype.onSeek = function (_time) {
        this.iterateOver(function (_widget) {
            if (!_widget.keepRunning(_time)) {
                this.deleteElement(_widget);
            }
        }.bind(this), this, et2_IOverlayElement);
        this.onTimeUpdate(_time);
    };
    /**
     * Periodically called while video is playing to add new overlay elements
     *
     * @param number _time
     */
    et2_smallpart_videooverlay.prototype.onTimeUpdate = function (_time) {
        var _this = this;
        // check if we seeking behind the last loaded element and there are more to fetch
        if (this.total > this.elements.length &&
            _time > this.elements[this.elements.length - 1].overlay_start) {
            this.fetchElements(this.elements.length).then(function () { return _this.onTimeUpdate(_time); });
            return;
        }
        var running = [];
        this.iterateOver(function (_widget) {
            running.push(_widget.options.overlay_id);
        }.bind(this), this, et2_IOverlayElement);
        this.elements.forEach(function (_element, _idx) {
            if (running.indexOf(_element.overlay_id) !== -1 &&
                _element.overlay_start == Math.floor(_time)) {
                this.createElement(_element);
                // fetch more elements, if we are reaching the end of the loaded ones
                if (this.total > this.elements.length && _idx > this.elements.length - 10) {
                    this.fetchElements(this.elements.length);
                }
            }
        }.bind(this));
    };
    /**
     * Called by element to be removed when it's done
     *
     * @param _element
     */
    et2_smallpart_videooverlay.prototype.deleteElement = function (_element) {
        _element.destroy();
        this.removeChild(_element);
    };
    /**
     * Create / show an overlay-element and add it to children
     *
     * @param _attrs
     */
    et2_smallpart_videooverlay.prototype.createElement = function (_attrs) {
        var _a;
        this.addChild(et2_core_widget_1.et2_createWidget(_attrs.overlay_type, _attrs, this));
        if (_attrs.overlay_player_mode & PlayerMode.Pause) {
            (_a = this.videobar) === null || _a === void 0 ? void 0 : _a.pause_video();
        }
        if (_attrs.overlay_player_mode & PlayerMode.Disable) {
            // ToDo: this.videobar?.
        }
    };
    et2_smallpart_videooverlay._attributes = {
        course_id: {
            name: 'course_id',
            type: 'integer',
            description: 'ID of course, required for server-side ACL check',
        },
        video_id: {
            name: 'video_id',
            type: 'integer',
            description: 'ID of video to load overlay for',
        },
        get_elements_callback: {
            name: 'get_elements_callback',
            type: 'string',
            description: 'menuaction to request elements of given video_id starting from given overlay_start time',
        },
        videobar: {
            name: 'videobar',
            type: 'string',
            description: 'videobar this overlay is for',
        },
        toolbar_save: {
            name: 'toolbar save',
            type: 'string',
            description: 'Save button in top bar controller',
        },
        toolbar_edit: {
            name: 'toolbar edit',
            type: 'string',
            description: 'edit button in top bar controller',
        },
        toolbar_cancel: {
            name: 'toolbar cancel',
            type: 'string',
            description: 'cancel button in top bar controller',
        },
        toolbar_delete: {
            name: 'toolbar delete',
            type: 'string',
            description: 'delete button in top bar controller',
        },
        toolbar_add: {
            name: 'toolbar add',
            type: 'string',
            description: 'Add button in top bar controller',
        },
        toolbar_starttime: {
            name: 'toolbar starttime',
            type: 'string',
            description: 'start-time in top bar controller',
        },
        toolbar_duration: {
            name: 'toolbar duration',
            type: 'string',
            description: 'Duration time button in top bar controller',
        }
    };
    return et2_smallpart_videooverlay;
}(et2_core_baseWidget_1.et2_baseWidget));
et2_core_widget_1.et2_register_widget(et2_smallpart_videooverlay, ["smallpart-videooverlay"]);
var PlayerMode;
(function (PlayerMode) {
    PlayerMode[PlayerMode["Unchanged"] = 0] = "Unchanged";
    PlayerMode[PlayerMode["Pause"] = 1] = "Pause";
    PlayerMode[PlayerMode["Disable"] = 2] = "Disable";
})(PlayerMode = exports.PlayerMode || (exports.PlayerMode = {}));
var et2_IOverlayElement = "et2_IOverlayElement";
function implements_et2_IOverlayElement(obj) {
    return implements_methods(obj, ["keepRunning"]);
}
var et2_IOverLayElementEditor = "et2_IOverLayElementEditor";
function implements_et2_IOverLayElementEditor(obj) {
    return implements_methods(obj, ["onSaveCallback"]);
}
var et2_smallpart_overlay_html = /** @class */ (function (_super) {
    __extends(et2_smallpart_overlay_html, _super);
    /**
     * Constructor
     */
    function et2_smallpart_overlay_html(_parent, _attrs, _child) {
        // Call the inherited constructor
        return _super.call(this, _parent, _attrs, et2_core_inheritance_1.ClassWithAttributes.extendAttributes(et2_smallpart_overlay_html._attributes, _child || {})) || this;
    }
    et2_smallpart_overlay_html.prototype.onSaveCallback = function () {
        var data = this.getValue();
    };
    et2_smallpart_overlay_html._attributes = {};
    return et2_smallpart_overlay_html;
}(et2_widget_htmlarea_1.et2_htmlarea));
exports.et2_smallpart_overlay_html = et2_smallpart_overlay_html;
et2_core_widget_1.et2_register_widget(et2_smallpart_overlay_html, ["smallpart-overlay-html"]);
/**
 * Overlay element to show some html
 */
var et2_smallpart_overlay_html_ro = /** @class */ (function (_super) {
    __extends(et2_smallpart_overlay_html_ro, _super);
    /**
     * Constructor
     */
    function et2_smallpart_overlay_html_ro(_parent, _attrs, _child) {
        var _this = 
        // Call the inherited constructor
        _super.call(this, _parent, _attrs, et2_core_inheritance_1.ClassWithAttributes.extendAttributes(et2_smallpart_overlay_html._attributes, _child || {})) || this;
        if (_this.options.duration)
            _this.setTimeout();
        return _this;
    }
    /**
     * Destructor
     */
    et2_smallpart_overlay_html_ro.prototype.destroy = function () {
        this.clearTimeout();
        _super.prototype.destroy.call(this);
    };
    /**
     * Clear timeout in case it's set
     */
    et2_smallpart_overlay_html_ro.prototype.clearTimeout = function () {
        if (typeof this.timeout_handle !== 'undefined') {
            window.clearTimeout(this.timeout_handle);
            delete (this.timeout_handle);
        }
    };
    /**
     * Set timeout to observer duration
     *
     * @param _duration in seconds, default options.duration
     */
    et2_smallpart_overlay_html_ro.prototype.setTimeout = function (_duration) {
        this.clearTimeout();
        this.timeout_handle = window.setTimeout(function () {
            this.parent.deleteElement(this);
        }.bind(this), 1000 * (_duration || this.options.duration));
    };
    /**
     * Callback called by parent if user eg. seeks the video to given time
     *
     * @param number _time new position of the video
     * @return boolean true: elements wants to continue, false: element requests to be removed
     */
    et2_smallpart_overlay_html_ro.prototype.keepRunning = function (_time) {
        if (typeof this.options.duration !== 'undefined') {
            if (this.options.overlay_start <= _time && _time < this.options.overlay_start + this.options.duration) {
                this.setTimeout(this.options.overlay_start + this.options.duration - _time);
                return true;
            }
            return false;
        }
        return true;
    };
    et2_smallpart_overlay_html_ro._attributes = {
        overlay_id: {
            name: 'overlay_id',
            type: 'integer',
            description: 'database id of element',
        },
        course_id: {
            name: 'course_id',
            type: 'integer',
            description: 'ID of course'
        },
        video_id: {
            name: 'video_id',
            type: 'integer',
            description: 'ID of video'
        },
        overlay_type: {
            name: 'overlay_type',
            type: 'string',
            description: 'type / class-name of overlay element'
        },
        overlay_start: {
            name: 'overlay_start',
            type: 'integer',
            description: 'start-time of element',
            default: 0
        },
        overlay_player_mode: {
            name: 'overlay_player_mode',
            type: 'integer',
            description: 'bit-field: &1 = pause, &2 = disable controls',
            default: 0
        },
        duration: {
            name: 'duration',
            type: 'integer',
            description: 'how long to show the element, unset of no specific type, eg. depends on user interaction',
            default: 5
        }
    };
    return et2_smallpart_overlay_html_ro;
}(et2_widget_description_1.et2_description));
exports.et2_smallpart_overlay_html_ro = et2_smallpart_overlay_html_ro;
et2_core_widget_1.et2_register_widget(et2_smallpart_overlay_html, ["smallpart-overlay-html_ro"]);
//# sourceMappingURL=et2_widget_videooverlay.js.map