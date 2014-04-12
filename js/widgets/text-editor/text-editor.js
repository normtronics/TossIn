define([
    'jquery',
    'text!widgets/text-editor/text-editor.htm',
    'jqueryui',
    'editor',
    'hotkeys'
], function ($, markup) {
    $.widget('tossin.texteditor', {
        options: {},
        updateText : function (text) {
            this.element.find('#editor').text(text);
        },
        _create : function () {
            this.element.addClass('textarea');
           this.element.append($(markup));
           
           var editor = this.element.find('#editor');
           editor.wysiwyg();
           editor.cleanHtml();
        },
        _destroy : function () {
            this.element.removeClass('textarea');
        }

    });
});
