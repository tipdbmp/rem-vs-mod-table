(function() { window.onload = function() {
    'use strict';

    document.title = 'A rem B vs A mod B';

    var $body = document.body;

    var $header = document.createElement('h2');
    $header.textContent = 'A rem B vs A mod B';

    var $equations = document.createElement('div');

    Dom.node_push($equations, 
        m('(A quot B) * B + (A rem B) = A'), nl(),
        t('=> '), m('(A rem B) = A - (A quot B) * B'), nl(),
        t('where: '), m('A quot B'), t(' is integer division truncated towards '), m('0'), nl(),
        nl(),

        m('(A div B) * B + (A mod B) = A'), nl(),
        t('=> '), m('A mod B = A - (A div B) * B'), nl(),
        t('where: '), m('A div B'), t(' is integer division truncated towards '), m('-infinity'), nl()    
    );


    var $inputs = document.createElement('table');
    $inputs.classList.add('inputs');
    
    var $A_range_a = input();
    $A_range_a.value = 10;
    var $A_range_b = input();
    $A_range_b.value = 14;

    var $B = input();
    $B.value= 5;

    Dom.node_push($inputs,
        tr(
            td( t('A range = ') ),
            td( t('[ '), $A_range_a, t(', '), $A_range_b, t(' ]') )
        ),
        tr( td( t('B = ') ), td($B) )
    );

    // The table is from here:
    // http://archive.adaic.com/standards/83lrm/html/lrm-04-05.html#4.5.5
    //
    var $table = document.createElement('table');
    $table.classList.add('table');

    var $table_header = document.createElement('tr');
    Dom.node_push($table_header,
        td('A'), td('B'), td('A/B'), td('A rem B'), td('A mod B'),
        td('A'), td('B'), td('A/B'), td('A rem B'), td('A mod B')
    );

    update_table();

    var $references = document.createElement('div');
    $references.classList.add('references');

    Dom.node_push($references,
        t('references: '), nl(), //nl(),
        t('1) '), a('table source', 'http://archive.adaic.com/standards/83lrm/html/lrm-04-05.html#4.5.5'), 
        t(' (scroll down a bit)'), nl(),
        t('2) '), a('quot, div, rem, mod', 'https://hackage.haskell.org/package/base-4.7.0.2/docs/Prelude.html#g:8'), 
                  t(' (search for `mod` and `rem`, include the backticks "`")'),
        nl(),
        t('3) '), a('mod equation', 'https://en.wikipedia.org/wiki/Floor_and_ceiling_functions#Mod_operator'), nl(),
        t('4) '), a("what '%' means in different languages", 'https://en.wikipedia.org/wiki/Modulo_operation#Remainder_calculation_for_the_modulo_operation'), 
        t(' (in JavaScript it means A rem B)'), nl(),
        t('')
    );

    var $table_info = document.createElement('div');
    $table_info.classList.add('table-info');

    Dom.node_push($table_info,
        t('Notice that the result of '), m('A rem B'), t(' has the sign of the first operand ('), m('A'), t(')'), nl(),
        t('and the result of '), m('A mod B'), t(' has the sign of the second operand ('), m('B'), t(')'), nl()
    );

    Dom.node_push($body,
        $header,
        $equations, nl(),
        $inputs, nl(),
        $table, nl(),
        $table_info,
        $references
        
    );


    // https://hackage.haskell.org/package/base-4.7.0.2/docs/Prelude.html#g:8
    // Search for `mod` or `rem`.

    // `div` is integer division truncated towards negative infinity
    //    (x `div` y)*y + (x `mod` y) == x
    // => (x `mod` y) == x - (x `div` y)*y
    //
    function mod(A, B) {
        // https://en.wikipedia.org/wiki/Floor_and_ceiling_functions#Mod_operator
        var A_over_B_truncated_towards_negative_infinity = Math.floor(A / B);
        var r = A - A_over_B_truncated_towards_negative_infinity * B;
        return r;
    }


    // `quot` is integer division truncated towards 0
    //    (x `quot` y)*y + (x `rem` y) == x
    // => (x `rem` y) == x - (x `quot` y)*y 
    //
    function rem(A, B) {
        // The 0|(<floating-point-number>) converts the floating-point number
        // to an integer.
        // https://stackoverflow.com/questions/596467/how-do-i-convert-a-float-number-to-a-whole-number-in-javascript/12837315#12837315
        // The double bitwise not operator '~~<floating-point-number>' works as 
        // well.
        // http://james.padolsey.com/javascript/double-bitwise-not/

        var A_over_B_truncated_towards_zero = 0|(A / B);
        var r = A - A_over_B_truncated_towards_zero * B;
        return r;
    }

    function rem_builtin(A, B) {
        return A % B;
    }    

    function tr() {
        var $tr = document.createElement('tr');
        Dom.node_push($tr, Array.prototype.slice.call(arguments));
        return $tr;
    }

    function td(content) {
        var $td = document.createElement('td');
        if (typeof content !== 'object') {
            $td.textContent = content;    
        }
        else {
            Dom.node_push($td, Array.prototype.slice.call(arguments));
        }
        return $td;
    }

    function empty_row() {
        var $tr = document.createElement('tr');
        var $td = document.createElement('td');
        $td.colSpan = 1e3;
//         $td.innerHTML = '&nbsp;';
        var nbsp = 0xA0;
        $td.textContent = String.fromCharCode(nbsp);
        Dom.node_push($tr, $td);
        return $tr;
    }

    function input() {
        var $input = document.createElement('input');
        $input.classList.add('input');
        input_set_number_value_range($input, 0, Infinity);
        $input.addEventListener('input', update_table);
        return $input;
    }

    function input_set_number_value_range($input, a, b) {
        $input.addEventListener('input', number_value_range);

        function number_value_range(event) {
            var number = $input.value.replace(/[^0-9]/g, '');
            number = parseInt(number, 10);

            if (isNaN(number)) {
                $input.value = '';
                return;
            }

            if      (number < a) { number = a; }
            else if (number > b) { number = b; }

            $input.value = ''+number;
        }

        return number_value_range; // removeEventListener?
    }   

    function nl() {
        var $nl = document.createElement('br');
        return $nl;
    }

    function t(text) {
        var $text = document.createElement('span');
        $text.textContent = text;
        return $text;
    }

    function m(math_text) {
        var $text = document.createElement('span');
        $text.classList.add('math-text');
        $text.textContent = math_text;
        return $text;
    }

    function a(text, href) {
        var $a = document.createElement('a');
        $a.textContent = text;
        $a.href = href;
        $a.target = '_blank';
        return $a;
    }     

    function update_table() {
        Dom.node_remove_all_children($table);

        Dom.node_push($table, 
            $table_header,
            empty_row()
        );

        var A_range = [
            Math.abs(parseInt($A_range_a.value, 10) || 0), 
            Math.abs(parseInt($A_range_b.value, 10) || 1)
        ];
        var B = parseInt($B.value, 10) || 0;

//    A      B   A/B   A rem B  A mod B     A     B    A/B   A rem B   A mod B
//    10     5    2       0        0       -10    5    -2       0         0
//    11     5    2       1        1       -11    5    -2      -1         4
//    12     5    2       2        2       -12    5    -2      -2         3
//    13     5    2       3        3       -13    5    -2      -3         2
//    14     5    2       4        4       -14    5    -2      -4         1        

        for (
            var A = A_range[0];
            A <= A_range[1];
            A++
        ) {
            var $tr = document.createElement('tr');
            Dom.node_push($tr,
                td(+A), td(+B), td(0|(+A / +B)), td(rem(+A, +B)), td(mod(+A, +B)),
                td(-A), td(+B), td(0|(-A / +B)), td(rem(-A, +B)), td(mod(-A, +B))
            );
            Dom.node_push($table, $tr);
        }

        Dom.node_push($table, empty_row());

        for (
            var A = A_range[0];
            A <= A_range[1];
            A++
        ) {
            var $tr = document.createElement('tr');
            Dom.node_push($tr,
                td(+A), td(-B), td(0|(+A / -B)), td(rem(+A, -B)), td(mod(+A, -B)),
                td(-A), td(-B), td(0|(-A / -B)), td(rem(-A, -B)), td(mod(-A, -B))
            );
            Dom.node_push($table, $tr);
        }        
    }
}}());