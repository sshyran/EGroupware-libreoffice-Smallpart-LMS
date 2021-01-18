/**
 * EGroupware SmallPART - Videooverlay multiple-choice question plugin
 *
 * @license http://opensource.org/licenses/gpl-license.php GPL - GNU General Public License
 * @package smallpart
 * @subpackage ui
 * @link https://www.egroupware.org
 * @author Ralf Becker <rb@egroupware.org>
 */

/*egw:uses
	/smallpart/js/overlay_plugins/et2_smallpart_question_text.js;
 */
import {et2_IOverlayElement, et2_IOverlayElementEditor} from "../et2_videooverlay_interface";
import {et2_smallpart_question_text, et2_smallpart_question_text_editor} from "./et2_smallpart_question_text";
import {et2_register_widget, WidgetConfig} from "../../../api/js/etemplate/et2_core_widget";
import {ClassWithAttributes} from "../../../api/js/etemplate/et2_core_inheritance";
import {et2_smallpart_overlay_html, et2_smallpart_overlay_html_editor} from "./et2_smallpart_overlay_html";

/**
 * Overlay element to show a multiple-choice question
 *
 * @ToDo extending et2_smallpart_question_text gives TypeError
 */
export class et2_smallpart_question_multiplechoice extends et2_smallpart_overlay_html implements et2_IOverlayElement
{
	static readonly _attributes : any = {
		answers: {
			name: 'possible answers',
			type: 'any',
			description: 'array of objects with attributes answer, correct, ...',
		},
	};

	/**
	 * Constructor
	 */
	constructor(_parent, _attrs? : WidgetConfig, _child? : object)
	{
		// Call the inherited constructor
		super(_parent, _attrs, ClassWithAttributes.extendAttributes(et2_smallpart_question_multiplechoice._attributes, _child || {}));
	}

	submit(_value, _attrs)
	{
		console.log(_value, _attrs);
		_attrs.answers = _value.answers;
		return _attrs;
	}
}
et2_register_widget(et2_smallpart_question_multiplechoice, ["smallpart-question-multiplechoice"]);

/**
 * Editor widget for multiple-choice question
 *
 * @ToDo extending et2_smallpart_question_text_editor gives TypeError
 */
export class et2_smallpart_question_multiplechoice_editor extends et2_smallpart_overlay_html_editor implements et2_IOverlayElementEditor
{
	static readonly _attributes : any = {
	};

	/**
	 * Constructor
	 */
	constructor(_parent, _attrs? : WidgetConfig, _child? : object)
	{
		// Call the inherited constructor
		super(_parent, _attrs, ClassWithAttributes.extendAttributes(et2_smallpart_question_multiplechoice_editor._attributes, _child || {}));
	}
}
et2_register_widget(et2_smallpart_question_multiplechoice_editor, ["smallpart-question-multiplechoice-editor"]);
