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

           function initToolbarBootstrapBindings() {
              var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier', 
              'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
              'Times New Roman', 'Verdana'],
              fontTarget = $('[title=Font]').siblings('.dropdown-menu');
              $.each(fonts, function (idx, fontName) {
                  fontTarget.append($('<li><a data-edit="fontName ' + fontName +'" style="font-family:\''+ fontName +'\'">'+fontName + '</a></li>'));
              });
              $('a[title]').tooltip({container:'body'});
              $('.dropdown-menu input').click(function() {return false;})
              .change(function () {$(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle');})
              .keydown('esc', function () {this.value='';$(this).change();});

              $('[data-role=magic-overlay]').each(function () { 
                var overlay = $(this), target = $(overlay.data('target')); 
                overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
            });
              if ("onwebkitspeechchange"  in document.createElement("input")) {
                var editorOffset = $('#editor').offset();
                //$('#voiceBtn').css('position','absolute').offset({top: editorOffset.top, left: editorOffset.left+$('#editor').innerWidth()-35});
            } else {
                $('#voiceBtn').hide();
            }
          }


           
    
           initToolbarBootstrapBindings(); 
           
           var editor = this.element.find('#editor');
           editor.wysiwyg();
           editor.cleanHtml();
        },
        _destroy : function () {
            this.element.removeClass('textarea');
        }

    });
});
