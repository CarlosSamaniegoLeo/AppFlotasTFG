// Definir el radio de acción de los coches (en metros)
const carRadius = 3000;

window.onload = function () {
    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([-3.74922, 40.463667]), // Centrado en España
            zoom: 6
        })
    });

    function cerrarSesion() {
        // Aquí puedes agregar más lógica antes de redirigir
        window.location.href = "/";
    }

    document.getElementById('cerrarSesionBtn').addEventListener('click', cerrarSesion);

    function calcularDistanciaEnMetros(coord1, coord2) {
        const radioTierra = 6371e3; // Radio de la Tierra en metros
        const dLat = gradoARadian(coord2.lat - coord1.lat);
        const dLng = gradoARadian(coord2.lng - coord1.lng);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(gradoARadian(coord1.lat)) * Math.cos(gradoARadian(coord2.lat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distancia = radioTierra * c; // Distancia en metros
        return distancia;
    }

    function gradoARadian(grados) {
        return grados * (Math.PI / 180);
    }

    function cargarMarcadores() {
        const idUsuario = 1;
        $.getJSON(`/Vehiculos/GetCochesPorUsuario?idUsuario=${idUsuario}`, function (coches) {
            const carCoordinates = coches.map(coche => {
                return {
                    lat: parseFloat(coche.Latitud),
                    lng: parseFloat(coche.Longitud)
                };
            });

            $.getJSON('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/', function (data) {
                const features = [];
                const gasolinerasEnRadio = [];

                data.ListaEESSPrecio.forEach(gasStation => {
                    const lat = parseFloat(gasStation.Latitud.replace(',', '.'));
                    const lon = parseFloat(gasStation['Longitud (WGS84)'].replace(/\s/g, '').replace(',', '.'));

                    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
                        const gasStationCoords = ol.proj.fromLonLat([lon, lat]);
                        const marker = new ol.Feature({
                            geometry: new ol.geom.Point(gasStationCoords)
                        });

                        features.push(marker);

                        let dentroDelRadio = false;
                        const gasStationLatLng = { lat, lng: lon };
                        for (let carCoord of carCoordinates) {
                            const distanceToCar = calcularDistanciaEnMetros(carCoord, gasStationLatLng);
                            if (distanceToCar <= carRadius) {
                                dentroDelRadio = true;
                                break;
                            }
                        }

                        if (dentroDelRadio) {
                            gasolinerasEnRadio.push(gasStation);
                        }
                    }
                });

                const vectorSource = new ol.source.Vector({
                    features: features
                });

                const clusterSource = new ol.source.Cluster({
                    distance: 50,
                    source: vectorSource
                });

                const clusterLayer = new ol.layer.Vector({
                    source: clusterSource,
                    style: function (feature) {
                        const size = feature.get('features').length;
                        let style;
                        if (size > 1) {
                            style = new ol.style.Style({
                                image: new ol.style.Circle({
                                    radius: 10,
                                    fill: new ol.style.Fill({
                                        color: '#3399CC'
                                    }),
                                    stroke: new ol.style.Stroke({
                                        color: '#fff',
                                        width: 2
                                    })
                                }),
                                text: new ol.style.Text({
                                    text: size.toString(),
                                    fill: new ol.style.Fill({
                                        color: '#fff'
                                    })
                                })
                            });
                        } else {
                            style = new ol.style.Style({
                                image: new ol.style.Icon({
                                    src: 'https://img.icons8.com/material-outlined/48/000000/gas-station--v1.png',
                                    scale: 0.5,
                                    color: 'green'
                                })
                            });
                        }
                        return style;
                    }
                });

                map.addLayer(clusterLayer);
                console.log("Cantidad de gasolineras dentro del radio:", gasolinerasEnRadio.length);

                document.getElementById('liveToastBtn').addEventListener('click', function () {
                    mostrarGasolinerasEnRadio(gasolinerasEnRadio, carCoordinates, coches);
                });
            });
        });
    }

    function agregarCoches() {
        const idUsuario = 1;
        $.getJSON(`/Vehiculos/GetCochesPorUsuario?idUsuario=${idUsuario}`, function (data) {
            const coches = data;
            const features = [];

            coches.forEach(coche => {
                const lat = parseFloat(coche.Latitud);
                const lon = parseFloat(coche.Longitud);

                if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
                    const carMarker = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat]))
                    });

                    const carStyle = new ol.style.Style({
                        image: new ol.style.Icon({
                            src: 'https://img.icons8.com/material-outlined/48/000000/car--v1.png',
                            scale: 1,
                            color: 'red'
                        })
                    });

                    carMarker.setStyle(carStyle);
                    features.push(carMarker);

                    const carCircle = new ol.Feature({
                        geometry: new ol.geom.Circle(ol.proj.fromLonLat([lon, lat]), carRadius)
                    });

                    const circleStyle = new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: 'rgba(255, 0, 0, 0.5)',
                            width: 2
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 0, 0, 0.1)'
                        })
                    });

                    carCircle.setStyle(circleStyle);
                    features.push(carCircle);
                }
            });

            const carSource = new ol.source.Vector({
                features: features
            });

            const carLayer = new ol.layer.Vector({
                source: carSource
            });

            map.addLayer(carLayer);
        });
    }

    function mostrarGasolinerasEnRadio(gasolineras, carCoordinates, coches) {
        const toastContainer = document.querySelector('.toast-container');
        toastContainer.innerHTML = '';

        const toastHTML = `
    <div class="toast w-100" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
        <div class="toast-header">
            <strong class="me-auto">Gasolineras dentro del radio</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body" style="max-height: calc(100vh - 20px); overflow-y: auto;">
            <select id="selectCoche" class="form-select mb-3" aria-label="Seleccione un coche">
                <option value="" selected>Seleccione un vehículo</option>
                ${coches.map((coche, index) => `
                    <option value="${index}">${coche.Matricula}</option>
                `).join('')}
            </select>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Localidad</th>
                        <th scope="col">Dirección</th>
                        <th scope="col">Precio Gasolina 95</th>
                        <th scope="col">Precio Gasóleo A</th>
                        <th scope="col">Ruta</th>
                    </tr>
                </thead>
                <tbody id="tablaGasolineras">
                    ${gasolineras.map((gasolinera, index) => `
                        <tr>
                            <td>${gasolinera.Localidad}</td>
                            <td>${gasolinera['Dirección']}</td>
                            <td>${gasolinera['Precio Gasolina 95']}</td>
                            <td>${gasolinera['Precio Gasóleo A']}</td>
                            <td><button type="button" class="btn btn-primary btn-sm" onclick="calcularYMostrarRuta(${index})">Ruta</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </div>
`;


        toastContainer.innerHTML += toastHTML;
        $('.toast').toast('show');

        document.getElementById('selectCoche').addEventListener('change', function () {
            const selectedCarIndex = this.value;
            if (selectedCarIndex === '') {
                // Si no se selecciona ningún vehículo, pasar undefined a la función actualizarTablaGasolineras
                actualizarTablaGasolineras(undefined, gasolineras);
            } else {
                const selectedCar = carCoordinates[selectedCarIndex];
                actualizarTablaGasolineras(selectedCar, gasolineras);
            }
        });


        console.log("Gasolineras dentro del radio:", gasolineras);

        window.calcularYMostrarRuta = function (index) {
            const gasolinera = gasolineras[index];
            const gasStationCoords = [parseFloat(gasolinera['Longitud (WGS84)'].replace(/\s/g, '').replace(',', '.')), parseFloat(gasolinera.Latitud.replace(',', '.'))];
            const carCoord = carCoordinates.find(coord => calcularDistanciaEnMetros(coord, { lat: gasStationCoords[1], lng: gasStationCoords[0] }) <= carRadius);

            if (carCoord) {
                calcularRuta(carCoord, gasStationCoords);

                // Cerrar el toast cuando se hace clic en el botón "Ruta"
                $('.toast').toast('hide');
            }
        }
    }

    function actualizarTablaGasolineras(selectedCar, gasolineras) {
        const tablaGasolineras = document.getElementById('tablaGasolineras');
        tablaGasolineras.innerHTML = '';

        if (selectedCar === undefined) {
            // Si el vehículo seleccionado es undefined, cargar todas las gasolineras
            gasolineras.forEach((gasolinera, index) => {
                tablaGasolineras.innerHTML += `
                <tr>
                    <td>${gasolinera.Localidad}</td>
                    <td>${gasolinera['Dirección']}</td>
                    <td>${gasolinera['Precio Gasolina 95']}</td>
                    <td>${gasolinera['Precio Gasóleo A']}</td>
                    <td><button type="button" class="btn btn-primary btn-sm" onclick="calcularYMostrarRuta(${index})">Ruta</button></td>
                </tr>
            `;
            });
        } else {
            // Si se selecciona un vehículo, cargar las gasolineras cercanas a ese vehículo
            gasolineras.forEach((gasolinera, index) => {
                const gasStationCoords = { lat: parseFloat(gasolinera.Latitud.replace(',', '.')), lng: parseFloat(gasolinera['Longitud (WGS84)'].replace(/\s/g, '').replace(',', '.')) };
                const distanceToCar = calcularDistanciaEnMetros(selectedCar, gasStationCoords);

                if (distanceToCar <= carRadius) {
                    tablaGasolineras.innerHTML += `
                    <tr>
                        <td>${gasolinera.Localidad}</td>
                        <td>${gasolinera['Dirección']}</td>
                        <td>${gasolinera['Precio Gasolina 95']}</td>
                        <td>${gasolinera['Precio Gasóleo A']}</td>
                        <td><button type="button" class="btn btn-primary btn-sm" onclick="calcularYMostrarRuta(${index})">Ruta</button></td>
                    </tr>
                `;
                }
            });
        }
    }


    let routeLayer = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 6,
                color: [40, 40, 40, 0.8]
            })
        })
    });

    // Añadir la capa de ruta al mapa si no existe
    map.addLayer(routeLayer);

    function calcularRuta(carCoord, gasStationCoords) {
        const carLonLat = [carCoord.lng, carCoord.lat];
        const gasStationLonLat = gasStationCoords;
        const carLonLatProj = ol.proj.fromLonLat(carLonLat);
        const gasStationLonLatProj = ol.proj.fromLonLat(gasStationLonLat);

        // Cambiar la URL a HTTPS
        const url = `https://router.project-osrm.org/route/v1/driving/${carLonLat.join(',')};${gasStationLonLat.join(',')}?overview=full&geometries=geojson`;

        $.getJSON(url, function (data) {
            if (data.routes.length > 0) {
                const route = new ol.format.GeoJSON().readFeature(data.routes[0].geometry, {
                    featureProjection: 'EPSG:3857'
                });
                // Limpiar la fuente de la capa de rutas antes de añadir la nueva ruta
                routeLayer.getSource().clear();
                routeLayer.getSource().addFeature(route);
                map.getView().fit(routeLayer.getSource().getExtent(), { duration: 1000 });
            }
        });
    }

    cargarMarcadores();
    agregarCoches();
};

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOMContentLoaded event triggered");
    const idUsuario = 1; // ID del usuario

    // Manejador de clic en el enlace 'Estadísticas Coche'
    document.getElementById('estadisticasCocheLink').addEventListener('click', function (event) {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace
        console.log("Haciendo clic en el enlace 'Estadísticas Coche'...");

        // Realizar una solicitud AJAX para obtener las matrículas de los coches del usuario
        $.getJSON(`/Vehiculos/GetCochesPorUsuario?idUsuario=${idUsuario}`, function (data) {
            console.log("Datos recibidos:", data);

            // Limpiar el menú desplegable
            const dropdownMenu = document.getElementById('dropdownMenu');
            dropdownMenu.innerHTML = '';

            // Agregar cada matrícula como un elemento de lista en el menú desplegable
            data.forEach((coche, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#trackerModal" data-coche-index="${index}">${coche.Matricula}</a>`;
                dropdownMenu.appendChild(listItem);
            });

            console.log("Matrículas de coches cargadas correctamente.");

            // Agregar evento de clic a cada elemento del menú desplegable
            dropdownMenu.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', function (event) {
                    event.preventDefault();
                    const cocheIndex = parseInt(this.getAttribute('data-coche-index'));
                    const coche = data[cocheIndex];
                    llenarModalConDatos(coche);
                });
            });
        });
    });
});

function llenarModalConDatos(coche) {
    console.log(coche); // Verificar el contenido del objeto coche
    document.getElementById('marca').value = coche.Marca || '';
    document.getElementById('modelo').value = coche.Modelo || '';
    document.getElementById('año').value = coche.Año || '';
    document.getElementById('latitud').value = coche.Latitud || '';
    document.getElementById('altitud').value = coche.Longitud || '';
    document.getElementById('autonomia_total').value = coche.AutonomiaTotal || '';
    document.getElementById('autonomia_restante').value = coche.AutonomiaRestante || '';
    document.getElementById('matricula').value = coche.Matricula || '';
    document.getElementById('idUsuario').value = coche.idUsuario || '';
}
