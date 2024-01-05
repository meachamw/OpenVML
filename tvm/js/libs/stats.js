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
function validateInput(dataStr) {
    var data = dataStr.split(",");	
	nData = new  Array(data.length);
	if (data.length < 5) {
			document.getElementById('Status').value = "Needs more Cow Bell (At least 5 Data Points)";
			document.getElementById('N').focus();
			return null;
	}		
	for (var i = 0; i < data.length; i++) {
		if (isNaN(data[i]) || data[i] == "") {
			document.getElementById('Status').value = "Entered Data is not valid";
			document.getElementById('N').focus();
			return null;
		} else {
			nData[i] = parseFloat(data[i]);
		}
    }
	document.getElementById('Status').value = "Enter the data below as a comma delimited list.  (Minimum of five data points)";
    return nData;
}

function calcStats() {
    var dataStr, data, xBar, sumX = 0, sumXSqr = 0, sumXminusMeanSqr = 0, sX, sigmaX, n, minX, Q1,med,Q3,maxX,medLoc;
	dataStr = document.getElementById('data').value;
    data = validateInput(dataStr);
	
	if (data != null) {
		data.sort((a,b) => a-b);
		console.log(data);
		n = data.length;
		for (var i = 0; i < data.length; i++) {
			sumX += data[i];
			sumXSqr += data[i] * data[i];
		}
		xBar = sumX/n;
		for (var i = 0; i < data.length; i++) {
			sumXminusMeanSqr += Math.pow(data[i]-xBar,2);
		}
		sX = Math.sqrt(sumXminusMeanSqr/(n-1));
		sigmaX = Math.sqrt(sumXminusMeanSqr/n);
		minX = data[0];
		maxX = data[data.length-1];
		med = getMedian(data,0,data.length);
		if (data.length%2 == 1) {
			Q1 = getMedian(data,0,Math.floor(data.length/2));
			Q3 = getMedian(data,Math.floor(data.length/2)+1,Math.floor(data.length/2));
		} else {
			Q1 = getMedian(data,0,data.length/2);
			Q3 = getMedian(data,data.length/2,data.length/2);
		}
		document.getElementById('xBar').value = xBar;
		document.getElementById('sumX').value = sumX;
		document.getElementById('sumXSqr').value = sumXSqr;
		document.getElementById('sX').value = sX;
		document.getElementById('sigmaX').value = sigmaX;
		document.getElementById('N').value = n;
		document.getElementById('Q1').value = Q1;
		document.getElementById('minX').value = minX;
		document.getElementById('maxX').value = maxX;
		document.getElementById('Q3').value = Q3;
		document.getElementById('med').value = med;
	}
}

function getMedian(data, dataStart, dataLength) {
	if (dataLength%2 == 1) {
		return data[dataStart + Math.floor(dataLength/2)];
	} else {
		return  (data[dataStart + dataLength/2-1]+data[dataStart + dataLength/2])/2;
	}
}
		
function factorial(n) {
  return (n != 1) ? n * factorial(n - 1) : 1;
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

	
