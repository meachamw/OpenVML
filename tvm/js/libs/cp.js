/*
	   Description:  Developed by William Meacham, and David Lippman.
	                 This is an Open Educational Resource (OER) designed to help students understand the fundamental concepts of mathematics.
					 For more information, contact William.Meacham@Scottsdalecc.edu  
	                 Copyright 2017: NonCommercial ShareAlike - International 4.0 - 
*/
function isMobile() {
	
	var index = navigator.appVersion.indexOf("Mobile");
	return (index > -1);
}
function updateCY() {
   document.getElementById('CY').value = document.getElementById('PY').value;
}
function updatePY() {
    document.getElementById('PY').value = document.getElementById('CY').value;
}
$(document).ready(function () {
     $(".numberinput").forceNumeric();
 });
/*$(document).ready( function() {
    if (!isMobile()) {
        $(".numberinput").click( function( event_details ) {
            $(this).select();
        });
    }
});
*/
// forceNumeric() plug-in implementation
jQuery.fn.forceNumeric = function () {

    return this.each(function () {
        $(this).keydown(function (e) {
            var key = e.which || e.keyCode;
            if (!e.shiftKey && !e.altKey && !e.ctrlKey &&
            // numbers   
                key >= 48 && key <= 57 ||
            // Numeric keypad
                key >= 96 && key <= 105 ||
            // comma, period and minus, . on keypad
               key === 190 || key === 188 || key === 109 || key === 110 ||
            // Backspace and Tab and Enter
               key === 8 || key === 9 || key === 13 || key === 189 || 173 ||
            // Home and End
               key === 35 || key === 36 ||
            // left and right arrows
               key === 37 || key === 39 ||
            // Del and Ins
               key === 46 || key === 45)
                return true;

            return false;
        });
    });
};
function validateInput() {
    var results = false;
	var n = document.getElementById('N').value;
	var r = document.getElementById('R').value;
	document.getElementById('NFact').value = "";
    document.getElementById('Perm').value = "";
    document.getElementById('Comb').value = "";
    if (isNaN(n)) {
        document.getElementById('Status').value = "n: is not a valid entry.";
        document.getElementById('N').focus();
    } else if (isNaN(r)) {
        document.getElementById('Status').value = "r: is not a valid entry.";
        document.getElementById('R').focus();
    } else if (!(Number.isInteger(parseFloat(n)) && 
	             Number.isInteger(parseFloat(r)))) {
        document.getElementById('Status').value = "both n and r must be integers";
        document.getElementById('N').focus(); 
    } else {
        document.getElementById('Status').value = "Enter n and r and click solve.       (Given n and r are integers greater than zero and n >= r)";
        results = true;
    }
    return results;
}

function PC() {
    var n,r,C = 0,P = 0,nFact;
    if (validateInput()) {
        n = parseInt(document.getElementById('N').value);
        r = parseInt(document.getElementById('R').value);        
		if (n == 0 && r >= 0) {
			P = 0;
			C = 0;
			nFact = 1;
		} else if ( r > n ) { // Invalid Entry
		    document.getElementById('Status').value = "n must be greater than  r";
            document.getElementById('N').focus();
			return;
		} else {
			nFact = factorial(n);
			nFact = Math.round(nFact);
			if (r == 0) { // || (r == n)) {
				P = 1;
				C = 1;
			} else {
				P = factorial(n)/factorial(n-r);
				P = Math.round(P);
				C = factorial(n)/(factorial(r)*factorial(n-r));
				C = Math.round(C);
			}
		}
		if (n > 20) 
			document.getElementById('NFact').value = nFact.toPrecision(9);
		else
			document.getElementById('NFact').value = formatNumber(nFact);			
        document.getElementById('Perm').value = formatNumber(P);
		document.getElementById('Comb').value = formatNumber(C);
    }
}

function factorial(n) {
  return (n != 0) ? n * factorial(n - 1) : 1;
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

	
