<?php
/**
 * EGroupware - SmallPart - setup definitions
 *
 * @link http://www.egroupware.org
 * @package smallpart
 * @subpackage setup
 * @license http://opensource.org/licenses/gpl-license.php GPL - GNU General Public License
 */

use EGroupware\Api;

$GLOBALS['egw_info'] = [
	'flags' => [
		'currentapp' => 'smallpart',
		'noheader'   => true,
	],
];

require_once __DIR__.'/../../header.inc.php';

$pdo = Api\Db\Pdo::connection();

function FunkDbParam()
{
	return Api\Db\Pdo::connection();
}
