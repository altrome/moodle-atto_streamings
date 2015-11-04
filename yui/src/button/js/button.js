// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_streamings
 * @copyright  COPYRIGHTINFO
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_streamings-button
 */

/**
 * Atto text editor streamings plugin.
 *
 * @namespace M.atto_streamings
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

var COMPONENTNAME = 'atto_streamings';
var VIDEOCONTROL = 'streamings_video';
var RTMPCONTROL = 'streamings_rtmp';
var PLAYLISTCONTROL = 'streamings_playlist';
var WEBCONTROL = 'streamings_web';
var LOGNAME = 'atto_streamings';

var CSS = {
        INPUTSUBMIT: 'atto_media_urlentrysubmit',
        INPUTCANCEL: 'atto_media_urlentrycancel',
        VIDEOCONTROL: 'videocontrol',
        RTMPCONTROL: 'rtmpcontrol',
        PLAYLISTCONTROL: 'playlistcontrol',
        WEBCONTROL: 'webcontrol'
    },
    SELECTORS = {
        VIDEOCONTROL: '.videocontrol',
        RTMPCONTROL: '.rtmpcontrol',
        PLAYLISTCONTROL: '.playlistcontrol',
        WEBCONTROL: '.webcontrol'
    };

var TEMPLATE = '' +
    '<form class="atto_form">' +
        '<div id="{{elementid}}_{{innerform}}" class="mdl-align">' +
            '<label for="{{elementid}}_{{VIDEOCONTROL}}">{{get_string "entervideo" component}}</label>' +
            '<input class="{{CSS.VIDEOCONTROL}} id="{{elementid}}_{{VIDEOCONTROL}}" name="{{elementid}}_{{VIDEOCONTROL}}" value="{{defaultvideo}}" />' +
            '<label for="{{elementid}}_{{RTMPCONTROL}}">{{get_string "enterrtmp" component}}</label>' +
            '<input class="{{CSS.RTMPCONTROL}} id="{{elementid}}_{{RTMPCONTROL}}" name="{{elementid}}_{{RTMPCONTROL}}" value="{{defaultrtmp}}" />' +
            '<label for="{{elementid}}_{{PLAYLISTCONTROL}}">{{get_string "enterplaylist" component}}</label>' +
            '<input class="{{CSS.PLAYLISTCONTROL}} id="{{elementid}}_{{PLAYLISTCONTROL}}" name="{{elementid}}_{{PLAYLISTCONTROL}}" value="{{defaultplaylist}}" />' +
            '<label for="{{elementid}}_{{WEBCONTROL}}">{{get_string "enterweb" component}}</label>' +
            '<input class="{{CSS.WEBCONTROL}} id="{{elementid}}_{{WEBCONTROL}}" name="{{elementid}}_{{WEBCONTROL}}" value="{{defaultweb}}" />' +
            '<button class="{{CSS.INPUTSUBMIT}}">{{get_string "insert" component}}</button>' +
        '</div>' +
        'icon: {{clickedicon}}'  +
    '</form>';
   
Y.namespace('M.atto_streamings').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

  
	/**
     * Initialize the button
     *
     * @method Initializer
     */
    initializer: function() {
        // If we don't have the capability to view then give up.
        if (this.get('disabled')){
            return;
        }

        var twoicons = ['iconone'];

        Y.Array.each(twoicons, function(theicon) {
            // Add the streamings icon/buttons
            this.addButton({
                icon: 'ed/' + theicon,
                iconComponent: 'atto_streamings',
                buttonName: theicon,
                callback: this._displayDialogue,
                callbackArgs: theicon
            });
        }, this);

    },

    /**
     * Get the id of the video control where we store the ice cream video
     *
     * @method _getVideoControlName
     * @return {String} the name/id of the video form field
     * @private
     */
    _getVideoControlName: function(){
        return(this.get('host').get('elementid') + '_' + VIDEOCONTROL);
    },
    
    /**
     * Get the id of the video control where we store the ice cream video
     *
     * @method _getRtmpControlName
     * @return {String} the name/id of the video form field
     * @private
     */
    _getRtmpControlName: function(){
        return(this.get('host').get('elementid') + '_' + RTMPCONTROL);
    },
    
    /**
     * Get the id of the video control where we store the ice cream video
     *
     * @method _getPlaylistControlName
     * @return {String} the name/id of the video form field
     * @private
     */
    _getPlaylistControlName: function(){
        return(this.get('host').get('elementid') + '_' + PLAYLISTCONTROL);
    },
    
    /**
     * Get the id of the video control where we store the ice cream video
     *
     * @method _getWebControlName
     * @return {String} the name/id of the video form field
     * @private
     */
    _getWebControlName: function(){
        return(this.get('host').get('elementid') + '_' + PLAYLISTCONTROL);
    },

     /**
     * Display the streamings Dialogue
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function(e, clickedicon) {
        e.preventDefault();
        var width=400;


        var dialogue = this.getDialogue({
            headerContent: M.util.get_string('dialogtitle', COMPONENTNAME),
            width: width + 'px',
            focusAfterHide: clickedicon
        });
		//dialog doesn't detect changes in width without this
		//if you reuse the dialog, this seems necessary
        if(dialogue.width !== width + 'px'){
            dialogue.set('width',width+'px');
        }

        //append buttons to iframe
        var buttonform = this._getFormContent(clickedicon);

        var bodycontent =  Y.Node.create('<div></div>');
        bodycontent.append(buttonform);

        //set to bodycontent
        dialogue.set('bodyContent', bodycontent);
        dialogue.show();
        this.markUpdated();
    },


     /**
     * Return the dialogue content for the tool, attaching any required
     * events.
     *
     * @method _getDialogueContent
     * @return {Node} The content to place in the dialogue.
     * @private
     */
    _getFormContent: function(clickedicon) {
        var template = Y.Handlebars.compile(TEMPLATE),
            content = Y.Node.create(template({
                elementid: this.get('host').get('elementid'),
                CSS: CSS,
                VIDEOCONTROL: VIDEOCONTROL,
                RTMPCONTROL: RTMPCONTROL,
                PLAYLISTCONTROL: PLAYLISTCONTROL,
                WEBCONTROL: WEBCONTROL,
                component: COMPONENTNAME,
                defaultvideo: this.get('defaultvideo'),
                defaultrtmp: this.get('defaultrtmp'),
                defaultplaylist: this.get('defaultplaylist'),
                defaultweb: this.get('defaultweb'),
                clickedicon: clickedicon
            }));

        this._form = content;
        this._form.one('.' + CSS.INPUTSUBMIT).on('click', this._doInsert, this);
        return content;
    },

    /**
     * Inserts the users input onto the page
     * @method _getDialogueContent
     * @private
     */
    _doInsert : function(e){
        e.preventDefault();
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        var videocontrol = this._form.one(SELECTORS.VIDEOCONTROL);
        var rtmpcontrol = this._form.one(SELECTORS.RTMPCONTROL);
        var playlistcontrol = this._form.one(SELECTORS.PLAYLISTCONTROL);
        var webcontrol = this._form.one(SELECTORS.WEBCONTROL);

        // If no file is there to insert, don't do it.
        if (!videocontrol.get('value')){
            Y.log('No video control or value could be found.', 'warn', LOGNAME);
            return;
        }
        
        // If no file is there to insert, don't do it.
        if (!rtmpcontrol.get('value')){
            Y.log('No rtmp control or value could be found.', 'warn', LOGNAME);
            return;
        }
        
        // If no file is there to insert, don't do it.
        if (!playlistcontrol.get('value')){
            Y.log('No playlist control or value could be found.', 'warn', LOGNAME);
            return;
        }
        
        // If no file is there to insert, don't do it.
        if (!webcontrol.get('value')){
            Y.log('No web control or value could be found.', 'warn', LOGNAME);
            return;
        }
        
        var insert_template =
            '<div id="videoStream"></div>' +
            '<script>' +
                'var playerInstance = jwplayer("videoStream");' +
                'playerInstance.setup({' +
                    'playlist: [{' +
                        'sources: [{' +
                            'file: "' + webcontrol.get('value') + '/' + playlistcontrol.get('value') + '"' +
                        '},{' +
                            'file: "' + rtmpcontrol.get('value') + '/cfx/st/mp4:' + videocontrol.get('value') + '"' +
                        '}]' +
                    '}],' +
                '});' +
                'if (mobileAndTabletcheck()) {' +
                    'playerInstance.setup({' +
                        'width: "100%",' +
                        'stretching: "none",' +
                        'file: "' + webcontrol.get('value') + playlistcontrol.get('value') + '"' +
                    '});' +
            '</script>';

        this.editor.focus();
        this.get('host').insertContentAtFocusPoint(insert_template);
        this.markUpdated();

    }
}, { ATTRS: {
		disabled: {
			value: false
		},

		usercontextid: {
			value: null
		},

		defaultvideo: {
			value: ''
		},
		
		defaultrtmp: {
			value: ''
		},
		
		defaultplaylist: {
			value: ''
		},
		
		defaultweb: {
			value: ''
		}
	}
});
