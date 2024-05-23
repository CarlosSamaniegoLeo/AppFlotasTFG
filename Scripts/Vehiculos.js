﻿const uid = sessionStorage.getItem('uid');
$(document).ready(function () {
    var $table = $('#table');

    // Función para agregar las opciones de años dinámicamente
    function loadYears() {
        var currentYear = new Date().getFullYear();
        for (var i = 1996; i <= currentYear; i++) {
            $('#año').append($('<option>', {
                value: i,
                text: i
            }));
        }
    }
    // Función para cargar los vehículos del usuario actual
    function loadUserVehicles() {
        $.ajax({
            url: '/Vehiculos/GetCochesPorUsuario',
            method: 'GET',
            data: { idUsuario: uid },
            dataType: 'json',
            success: function (data) {
                if (data.length > 0) {
                    // Filtrar los vehículos asociados al usuario actual (filtrar por idUsuario)
                    var userVehicles = data.filter(function (vehicle) {
                        return vehicle.idUsuario === uid;
                    });
                    // Si hay vehículos asociados al usuario, cargar los datos en la tabla
                    $table.bootstrapTable('destroy').bootstrapTable({
                        data: userVehicles
                    });
                } else {
                    
                    // Si hay vehículos asociados al usuario, cargar los datos en la tabla
                    $table.bootstrapTable('destroy').bootstrapTable({
                        data: []
                    });
                    // Si el usuario no tiene vehículos asociados, mostrar un mensaje o realizar otra acción
                    alert('El usuario no tiene vehículos asociados.');
                }
            },
            error: function () {
                alert('Error al cargar los vehículos del usuario.');
            }
        });
    }


    // Cargar opciones de marcas desde la base de datos
    function loadMarcas() {
        $.ajax({
            url: '/Vehiculos/Marcas',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#marca').empty();
                if (data.length > 0) {
                    $('#marca').append($('<option>').text('Selecciona una Marca').attr('value', ''));
                    $.each(data, function (index, value) {
                        $('#marca').append($('<option>').text(value).attr('value', value));
                    });
                } else {
                    $('#marca').append($('<option>').text('No hay marcas disponibles').attr('disabled', true).attr('selected', true));
                }
            },
            error: function () {
                alert('Error al cargar las marcas de coches.');
            }
        });
    }

    // Cargar modelos según la marca seleccionada
    $('#marca').change(function () {
        var marca = $(this).val();
        if (marca !== '') {
            $.ajax({
                url: '/Vehiculos/ModelosPorMarca',
                method: 'GET',
                data: { marca: marca },
                dataType: 'json',
                success: function (data) {
                    $('#modelo').empty();
                    if (data.length > 0) {
                        $.each(data, function (index, value) {
                            $('#modelo').append($('<option>').text(value).attr('value', value));
                        });
                    } else {
                        $('#modelo').append($('<option>').text('Debes seleccionar una marca').attr('disabled', true).attr('selected', true));
                    }
                },
                error: function () {
                    alert('Error al cargar los modelos de coches.');
                }
            });
        } else {
            $('#modelo').empty();
            $('#modelo').append($('<option>').text('Debes seleccionar una marca').attr('disabled', true).attr('selected', true));
        }
    });

    // Eliminar la selección inicial
    $table.bootstrapTable('uncheckAll');
    $table.on('check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table', function () {
        var selections = $table.bootstrapTable('getSelections');
        $('#edit').prop('disabled', selections.length !== 1);
        $('#delete').prop('disabled', selections.length === 0);
    });

    // Manejar el clic en el botón de creación
    $('#toolbar').on('click', '#create', function () {
        // Limpiar el formulario al abrir el modal para crear un nuevo vehículo
        $('#vehiculoForm')[0].reset();
        $('#modelo').empty().append('<option value="">Seleccione una Marca</option>');
        $('#trackerModal').modal('show');
    });
    // Manejar el clic en el botón "Mapa"
    $('#mapButton').click(function () {
        window.location.href = "/Map";
    });
    // Función para cargar modelos basados en la marca seleccionada
    function loadModelos(marcaSeleccionada) {
        if (marcaSeleccionada !== '') {
            $.ajax({
                url: '/Vehiculos/ModelosPorMarca',
                method: 'GET',
                data: { marca: marcaSeleccionada },
                dataType: 'json',
                success: function (data) {
                    $('#modelo').empty();
                    if (data.length > 0) {
                        $.each(data, function (index, value) {
                            $('#modelo').append($('<option>').text(value).attr('value', value));
                        });
                    } else {
                        $('#modelo').append($('<option>').text('Debes seleccionar una marca').attr('disabled', true).attr('selected', true));
                    }
                },
                error: function () {
                    alert('Error al cargar los modelos de coches.');
                }
            });
        } else {
            $('#modelo').empty();
            $('#modelo').append($('<option>').text('Debes seleccionar una marca').attr('disabled', true).attr('selected', true));
        }
    }

    // Manejar el clic en el botón de edición
    $('#toolbar').on('click', '#edit', function () {
        var selectedRows = $table.bootstrapTable('getSelections');

        if (selectedRows.length > 0) {
            var selectedRow = selectedRows[0];

            // Cargar los valores del vehículo seleccionado en el formulario de edición
            $('#idCocheHidden').val(selectedRow.idCoche); // Establecer el valor del campo oculto
            $('#idUsuarioHidden').val(selectedRow.idUsuario); // Establecer el valor del campo oculto

            $('#marca').val(selectedRow.Marca);
            $('#año').val(selectedRow.Año);
            $('#latitud').val(selectedRow.Latitud);
            $('#longitud').val(selectedRow.Longitud);
            $('#autonomia_total').val(selectedRow.AutonomiaTotal);
            $('#autonomia_restante').val(selectedRow.AutonomiaRestante);
            $('#matricula').val(selectedRow.Matricula);

            // Cargar los modelos basados en la marca seleccionada
            loadModelos(selectedRow.Marca);

            $('#trackerModal').modal('show');
        } else {
            alert('Seleccione una fila para editar.');
        }
    });

    $('#table').on('click', 'input[type="checkbox"]', function () {
        var $checkbox = $(this);
        if ($checkbox.is(':checked')) {
            $('input[type="checkbox"]').not($checkbox).prop('checked', false);
        }
    });
    $('#delete').click(function () {
        var selectedRows = $table.bootstrapTable('getSelections');
        var ids = selectedRows.map(row => row.idCoche);

        if (ids.length > 0) {
            if (confirm('¿Estás seguro de que deseas eliminar el coche seleccionado?')) {
                $.ajax({
                    url: '/Vehiculos/DeleteCoches',
                    method: 'POST',
                    data: { ids: ids },
                    success: function (response) {
                        if (response.success) {
                            alert('Coche(s) eliminado(s) correctamente.');
                            // Recargar la tabla después de la eliminación
                            $table.bootstrapTable('refresh');
                        } else {
                            alert('Error al eliminar coche(s).');
                        }
                    },
                    error: function () {
                        alert('Error de conexión.');
                    }
                });
            }
        } else {
            alert('Seleccione al menos un coche para eliminar.');
        }
    });

    $('#crearProyectoBtn').click(function () {
        // Limpiar mensajes de error anteriores
        $('.error-message').text('');

        // Obtener los valores de los campos
        var marca = $('#marca').val();
        var modelo = $('#modelo').val();
        var año = $('#año').val();
        var latitud = $('#latitud').val();
        var longitud = $('#longitud').val();
        var autonomiaTotal = $('#autonomia_total').val();
        var autonomiaRestante = $('#autonomia_restante').val();
        var matricula = $('#matricula').val();

        // Bandera para validar si el formulario es válido
        var isValid = true;

        // Validar cada campo
        if (!marca) {
            $('#error-marca').text('Por favor, rellene este campo.');
            isValid = false;
        }

        if (!modelo) {
            $('#error-modelo').text('Por favor, rellene este campo.');
            isValid = false;
        }

        if (!año) {
            $('#error-año').text('Por favor, rellene este campo.');
            isValid = false;
        }

        if (!latitud) {
            $('#error-latitud').text('Por favor, rellene este campo.');
            isValid = false;
        }

        if (!longitud) {
            $('#error-longitud').text('Por favor, rellene este campo.');
            isValid = false;
        }

        if (!autonomiaTotal) {
            $('#error-autonomia_total').text('Por favor, rellene este campo.');
            isValid = false;
        }

        if (!autonomiaRestante) {
            $('#error-autonomia_restante').text('Por favor, rellene este campo.');
            isValid = false;
        }

        if (!matricula) {
            $('#error-matricula').text('Por favor, rellene este campo.');
            isValid = false;
        }

        // Si el formulario no es válido, detener la ejecución
        if (!isValid) {
            return;
        }

        // Crear el objeto nuevoCoche si todos los campos están completos
        var nuevoCoche = {
            idCoche: $('#idCocheHidden').val(), // Obtener el valor del campo oculto
            marca: marca,
            modelo: modelo,
            año: parseInt(año), // Convertir a entero
            latitud: latitud, // Si es necesario, convertir a flotante
            longitud: longitud, // Si es necesario, convertir a flotante
            autonomiaTotal: parseInt(autonomiaTotal),
            autonomiaRestante: parseInt(autonomiaRestante),
            matricula: matricula,
            idUsuario: uid // O el valor que desees
        };

        // Enviar el objeto nuevoCoche al servidor
        $.ajax({
            url: '/Vehiculos/CrearCoche',
            method: 'POST',
            data: nuevoCoche,
            success: function (response) {
                if (response.success) {
                    alert('Coche creado correctamente.');
                    $('#trackerModal').modal('hide');
                    // Actualizar la tabla después de la creación
                    $('#table').bootstrapTable('refresh', { silent: true });
                } else {
                    alert('Error al crear el coche: ' + response.message);
                }
            },
            error: function () {
                alert('Error de conexión al crear el coche.');
            }
        });
    });
    loadUserVehicles();
    // Llama a la función loadYears() para agregar las opciones de años al select
    loadYears();

    // Inicializar opciones y datos
    loadMarcas();
});
