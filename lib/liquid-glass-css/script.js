$(document).ready(function () {
    const $hint = $(".hint");
    let hintDismissed = false;

    function dismissHint() {
        if (hintDismissed) return;
        hintDismissed = true;
        $hint.removeClass("is-visible");
    }

    $hint.addClass("is-visible");
    setTimeout(dismissHint, 6000);

    $(".draggable").draggable({
        start: dismissHint
    });

    $(".bg-option").on("click", function () {
        const bg = $(this).data("bg");
        $("body").css("background-image", "url('" + bg + "')");
        $(".bg-option").removeClass("is-active");
        $(this).addClass("is-active");
    });
});
