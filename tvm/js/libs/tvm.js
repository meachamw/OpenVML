/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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
    document.getElementById('Status').value = "";
    if (isNaN(document.getElementById('N').value)) {
        document.getElementById('Status').value = "N: is not a valid entry.";
        document.getElementById('N').focus();
    }else if (isNaN(document.getElementById('I').value)) {
        document.getElementById('Status').value = "I: is not a valid entry.";
        document.getElementById('I').focus();
    }else if (isNaN(document.getElementById('PV').value)) {
        document.getElementById('Status').value = "PV: is not a valid entry.";
        document.getElementById('PV').focus();
    } else if (isNaN(document.getElementById('PMT').value)) {
        document.getElementById('Status').value = "PMT: is not a valid entry.";
        document.getElementById('PMT').focus();
    }else if (isNaN(document.getElementById('FV').value)) {
        document.getElementById('Status').value = "FV: is not a valid entry.";
        document.getElementById('FV').focus();
    }else if (isNaN(document.getElementById('PY').value)) {
        document.getElementById('Status').value = "PY: is not a valid entry.";
        document.getElementById('PY').focus();
    }else if (isNaN(document.getElementById('CY').value)) {
        document.getElementById('Status').value = "CY: is not a valid entry.";
        document.getElementById('CY').focus();
    } else {
        results = true;
    }
    return results;
}

function FV() {
    var bigN, littleN, principal, interest, payment,rate,accruedVal,x;
    if (validateInput()) {
        bigN = parseFloat(document.getElementById('N').value);
        littleN = parseFloat(document.getElementById('PY').value);
        principal = parseFloat(document.getElementById('PV').value);
        interest = parseFloat(document.getElementById('I').value);
        payment = parseFloat(document.getElementById('PMT').value);
        rate = eval((interest)/(littleN * 100));
        if ( rate === 0 ) // Interest rate is 0
        {
            accruedVal = -(principal + (payment * bigN));
        } else {
            x = Math.pow(1 + rate, bigN);
            accruedVal = - ( -payment + x * payment + rate * x * principal ) /rate;
        }
        accruedVal = Math.round(accruedVal*100)/100;
        document.getElementById('FV').value = accruedVal;
    }
}
function PV() {
    var bigN, littleN, principal, interest, payment,rate,accruedVal,x,y;
    if (validateInput()) {
        bigN = parseFloat(document.getElementById('N').value);
        littleN = parseFloat(document.getElementById('PY').value);
        principal = parseFloat(document.getElementById('PV').value);
        interest = parseFloat(document.getElementById('I').value);
        payment = parseFloat(document.getElementById('PMT').value);
        accruedVal = parseFloat(document.getElementById('FV').value);
        rate = eval((interest)/(littleN * 100));
        if ( rate === 0 ) // Interest rate is 0
        {
            principal = -(accruedVal - (payment * bigN));
        } else {
//                  y = Math.pow(1 + rate, bigN);
            x = Math.pow(1 + rate, bigN);
            principal = (-accruedVal*rate+payment-x*payment)/(rate*x);
        }
        principal = Math.round(principal*100)/100;
        document.getElementById('PV').value = principal;
    }
}
function PMT() {
    var bigN, littleN, principal, interest, payment,rate,accruedVal,x;
    if (validateInput()) {
        bigN = parseFloat(document.getElementById('N').value);
        littleN = parseFloat(document.getElementById('PY').value);
        principal = parseFloat(document.getElementById('PV').value);
        interest = parseFloat(document.getElementById('I').value);
        payment = parseFloat(document.getElementById('PMT').value);
        accruedVal = parseFloat(document.getElementById('FV').value);
        rate = eval((interest)/(littleN * 100));
        if ( rate === 0 ) // Interest rate is 0
        {
            accruedVal = -(principal + (payment * bigN));
        } else {
            x = Math.pow(1 + rate, bigN);
            payment = (-accruedVal * rate - rate*x*principal)/(x-1);
        }
        payment = Math.round(payment*100)/100;
        document.getElementById('PMT').value = payment;
    }
}
function bigN() {
    var bigN, littleN, principal, interest, payment,rate,accruedVal,x;
    if (validateInput()) {
        bigN = parseFloat(document.getElementById('N').value);
        littleN = parseFloat(document.getElementById('PY').value);
        principal = parseFloat(document.getElementById('PV').value);
        interest = parseFloat(document.getElementById('I').value);
        payment = parseFloat(document.getElementById('PMT').value);
        accruedVal = parseFloat(document.getElementById('FV').value);
        rate = eval((interest)/(littleN * 100));
        if ( rate === 0 ) // Interest rate is 0
        {
            bigN = - (accruedVal + principal)/payment;
        } else {

//nper_value = Math.log((-fv * rate + pmt)/(pmt + rate * pv))/ Math.log(1 + rate);
            bigN = Math.log((-accruedVal*rate+payment)/(payment+rate*principal))/Math.log(1+rate);
        }
        bigN = Math.round(bigN*100)/100;
        document.getElementById('N').value = bigN;
    }
}
function interest() {
    var bigN, littleN, principal, interest, payment,rate,
            accruedVal,totalPaid,interestPaid,years,addon,lo_i,hi_i;
    if (validateInput()) {
        bigN = parseFloat(document.getElementById('N').value);
        littleN = parseFloat(document.getElementById('PY').value);
        principal = parseFloat(document.getElementById('PV').value);
        interest = parseFloat(document.getElementById('I').value);
        payment = parseFloat(document.getElementById('PMT').value);
        accruedVal = parseFloat(document.getElementById('FV').value);
        interest = calcNR(payment, principal, accruedVal, bigN, littleN);
        interest = Math.round(interest*100)/100;
        document.getElementById('I').value = interest;
    }
}

 
function calcPV(inPMT, inFV, inNR, inNP, inC) {
	var outPV = inFV*Math.pow((1 + inNR/(100*inC)),(-inNP));
 	if (inNR === 0) {
 		outPV = outPV + inPMT*inNP;
 	} else {
 		outPV = outPV + inPMT*((1-(Math.pow((1 + inNR/(100*inC)),(-inNP))))/(inNR/(100*inC)));
 	}
 	return outPV;
}
function calcNR(inPMT, inPV, inFV, inNP, inC) {
	var	outNR = 0.1; // initial guess
	var	thePV1, thePV2, theDeriv;
	var	theH = 0.00001;
	var	i = 1;
	var	theZeros = 0;
	var lastNR = outNR;
	//alert("PV " + inPV + " PMT " + inPMT + " FV " + inFV + " NP " + inNP);
	if (inNP <= 0) { // should throw an exception
            document.getElementById('Status').value = "The Nominal Rate cannot be computed.";
		return outNR = "";
	}
	if (inFV === 0) {
		theZeros++;
	}	
	if (inPMT === 0) {
		theZeros++;
	}	
	if (inPV === 0) {
		theZeros++;
		// inFV *= -1;
	}
	if (theZeros >= 2) { // should throw an exception
            document.getElementById('Status').value = "The Nominal Rate cannot be computed.";
		return outNR = "";
	}
	if ((inPV > 0) && (inPMT >= 0) && (inFV >= 0)) {
            document.getElementById('Status').value = "The Nominal Rate cannot be computed.";
		return outNR = "";
	}
	if ((inPV === 0) && (inPMT >= 0) && (inFV >= 0)) {
            document.getElementById('Status').value = "The Nominal Rate cannot be computed.";
		return outNR = "";
	}
	inPV *= -1;
	//thePV1 = calcPV(inPMT,inFV,outNR*100,inNP,inC);
	//alert("thePV1 " + thePV1 + " " + inPV);
	do {
		thePV1 = calcPV(inPMT,inFV,(outNR*100),inNP,inC) - inPV;
		theDeriv = ((calcPV(inPMT,inFV,((outNR+theH)*100),inNP,inC) - inPV) - thePV1)/theH;
		thePV2 = thePV1;
		//if ((theDeriv == 0) && (Math.abs(thePV2) > 0)) { // should throw an exception
		//	alert("The Nominal Rate cannot be computed. 5");
		//	return outNR = "";
		//}
		lastNR = outNR;
		outNR = outNR - thePV1/theDeriv;
		if (i > 200) { // should throw an exception
			alert("The Nominal Rate cannot be computed.");
			return outNR = "";
		}
		i++;
		if (thePV2 < 0) thePV2 *= -1;
	} while (thePV2 > 0.0001);
	return (lastNR*100); // maybe should change to give the previous rate	
}
