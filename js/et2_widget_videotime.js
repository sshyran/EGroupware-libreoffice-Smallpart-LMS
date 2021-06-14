/**
 * EGroupware - SmallParT - videobar widget
 *
 * @link https://www.egroupware.org
 * @package smallpart
 * @subpackage Ui
 * @license http://opensource.org/licenses/gpl-license.php GPL - GNU General Public License
 */
import { et2_description } from "../../api/js/etemplate/et2_widget_description";
import { et2_register_widget } from "../../api/js/etemplate/et2_core_widget";
import { ClassWithAttributes } from '../../api/js/etemplate/et2_core_inheritance';
export class et2_smallpart_videotime extends et2_description {
    /**
     * Constructor
     */
    constructor(_parent, _attrs, _child) {
        // Call the inherited constructor
        super(_parent, _attrs, ClassWithAttributes.extendAttributes(et2_smallpart_videotime._attributes, _child || {}));
        this.span.addClass('smallpart-videotime');
    }
    set_value(_value) {
        let time = new Date(null);
        time.setSeconds(parseInt(_value));
        return super.set_value(time.toISOString().substr(11, 8));
    }
}
et2_smallpart_videotime._attributes = {
    value: {
        name: 'Value',
        type: 'integer',
        description: 'Elapsed time in seconds',
        default: 0
    },
};
et2_register_widget(et2_smallpart_videotime, ["smallpart-videotime"]);
//# sourceMappingURL=et2_widget_videotime.js.map