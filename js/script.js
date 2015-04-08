$(function () {
  'use strict';

  if ( localStorage.formState ) {
    restore(JSON.parse(localStorage.formState));
  }

  function render ( data ) {
    var output = [];
    if ( data.head ) {
      output.push(data.head);
    }
    if ( data.root ) {
      output.push('');
      output.push('root = ' + data.root);
    }
    $(data.rules).map(function ( idx, rule ) {
      output.push('');
      if ( rule.target ) {
        output.push('[' + rule.target + ']');
      } else {
        return;
      }
      if ( rule.charset ) {
        output.push('charset = ' + rule.charset)
      }
      if ( rule.indent_style ) {
        output.push('indent_style = ' + rule.indent_style)
      }
      if ( rule.indent_size ) {
        output.push('indent_size = ' + rule.indent_size);
      }
      if ( rule.tab_width ) {
        output.push('tab_width = ' + rule.tab_width);
      }
      if ( rule.end_of_line ) {
        output.push('end_of_line = ' + rule.end_of_line)
      }
      if ( rule.insert_final_newline ) {
        output.push('insert_final_newline = ' + rule.insert_final_newline)
      }
    })
    $('#output').text(output.join("\n"));
    hljs.highlightBlock(document.getElementById('output'));
  }

  function restore ( data ) {
    $('#root').attr('checked', data.root);
    $(data.rules).map(function ( idx, rule ) {
      var id = rule.id;
      if ( idx >= 1 && rule.target ) {
        addBlock();
      }
      $('#rule-' + id + '-target').val(rule.target);
      $('#rule-' + id + '-charset').val(rule.charset);
      $('#rule-' + id + '-indent_style').val(rule.indent_style);
      $('#rule-' + id + '-indent_size').val(rule.indent_size);
      $('#rule-' + id + '-tab_width').val(rule.tab_width);
      $('#rule-' + id + '-end_of_line').val(rule.end_of_line);
      $('#rule-' + id + '-insert_final_newline').val(rule.insert_final_newline);
    });
  }

  function addBlock () {
    var $lastBlock = $('.block').eq(-1);
    var $newBlock = $lastBlock.clone(true, true);
    var lastIndex = $('.block').length;
    var pattern = new RegExp('-' + (lastIndex - 1) + '-', 'g');
    $newBlock.html($newBlock.html().replace(pattern, '-' + lastIndex + '-'));
    $newBlock.insertAfter($lastBlock);
  }

  function removeBlock ( target ) {
    if ( $('.block').length > 1 ) {
      if ( window.confirm('このルールを削除しますか？') ) {
        var $block = $(target).closest('.block');
        $block.remove();
      }
    }
  }

  $('#input').on('init change keyup', function (e) {
    var data = {};
    data['head'] = "# EditorConfig is awesome: http://EditorConfig.org";
    data['root'] = $('#root').is(':checked');
    data['rules'] = [];
    $(this).find('.block').each(function ( idx, block ) {
      var id = $(block).html().match(/-(\d+?)-/)[1];
      var rule = {
        "id": id,
        "target": $('#rule-' + id + '-target').val(),
        "charset": $('#rule-' + id + '-charset').val(),
        "indent_style": $('#rule-' + id + '-indent_style').val(),
        "indent_size": $('#rule-' + id + '-indent_size').val(),
        "tab_width": $('#rule-' + id + '-tab_width').val(),
        "end_of_line": $('#rule-' + id + '-end_of_line').val(),
        "insert_final_newline": $('#rule-' + id + '-insert_final_newline').val()
      };
      data['rules'].push(rule);
    });
    render(data);
    localStorage.setItem('formState', JSON.stringify(data));
  }).trigger('init');

  $(document).on('click', '[href="#add"]', function ( e ) {
    e.preventDefault();
    addBlock();
    $('#input').trigger('init');
  });

  $(document).on('click', '[href="#remove"]', function ( e ) {
    e.preventDefault();
    removeBlock(e.target);
    $('#input').trigger('init');
  });

});
