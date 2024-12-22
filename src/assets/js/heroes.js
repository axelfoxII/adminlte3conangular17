
$.ajax({
    url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json',
    dataType: 'json',
    success: function (data) {
        $("#tableHeroes").DataTable({
            responsive: true,
            sLengthMenu: true,
            autoWidth: false,
            buttons: ["excel", "pdf"],
            language: data
        }).buttons().container().appendTo('#tablePro_wrapper .col-md-6:eq(0)');
    }
});