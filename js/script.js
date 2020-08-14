$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });
});


$(document).ready(function () {
    $('.modal').each(function () {
        const modalId = `#${$(this).attr('id')}`;
        if (window.location.href.indexOf(modalId) !== -1) {
            $(modalId).modal('show');
        }
    });
});

function reload1() { 
    document.getElementById('if1').src += ''; 
} 
btn1.onclick = reload1;

function reload2() { 
    document.getElementById('if2').src += ''; 
} 
btn2.onclick = reload2; 

function reload3() { 
    document.getElementById('if3').src += ''; 
} 
btn3.onclick = reload3; 

function reload4() { 
    document.getElementById('if4').src += ''; 
} 
btn4.onclick = reload4; 

function reload5() { 
    document.getElementById('if5').src += ''; 
} 
btn5.onclick = reload5; 

function reload6() { 
    document.getElementById('if6').src += ''; 
} 
btn6.onclick = reload6; 

function reload7() { 
    document.getElementById('if7').src += ''; 
} 
btn7.onclick = reload7; 

