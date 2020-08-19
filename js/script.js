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
            const iframe = $(modalId).contents().find("iframe");
            const source = $(iframe).attr("data-src");
            if (source !== -1) {
                $(iframe).attr("src", source);
            }
            
        }
    });
});

