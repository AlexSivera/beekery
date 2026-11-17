/* Datos del negocio — editar aquí horarios, teléfono y agenda.
   main.js los usa para el estado "Abierto ahora", el día de hoy
   en la agenda y el mensaje de WhatsApp de encargos. */
(function () {
  "use strict";
  window.__BRAND__ = {
    name: "Beekery",
    phone: "+34722348941",
    phoneLabel: "722 34 89 41",
    whatsapp: "34722348941",
    address: "Av. de Gandia, 25 · 03700 Dénia, Alicante",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Beekery+Obrador+Av.+de+Gandia+25+D%C3%A9nia",

    // Horario por día de la semana (0 = domingo … 6 = sábado). null = cerrado.
    // Horas en formato decimal: 8 = 8:00, 19.5 = 19:30.
    hours: {
      0: [9, 14],
      1: null,
      2: [8, 19],
      3: [8, 19],
      4: [8, 19],
      5: [8, 19],
      6: [9, 14]
    },

    // Horario de cada obrador (mismo formato que hours)
    sedes: {
      gandia: { 0: [9, 14], 1: null, 2: [8, 19], 3: [8, 19], 4: [8, 19], 5: [8, 19], 6: [9, 14] },
      madrigueres: { 0: [9, 14], 1: null, 2: [8, 16], 3: [8, 16], 4: [8, 16], 5: [8, 16], 6: [9, 14] }
    },

    // Panes que salen del horno cada día (mismo índice que hours)
    agenda: {
      2: ["Multicereales", "Blat de la Marina", "Pan inglés integral"],
      3: ["Espelta integral", "Centeno", "Chapata"],
      4: ["Multicereales", "Blat de la Marina con espelta", "Trigo sarraceno"],
      5: ["Espelta", "Brioche en molde", "Blat de la Marina", "Chapata"],
      6: ["Espelta integral", "Multicereal", "Blat de la Marina", "Creación Beekery"],
      0: ["Espelta", "Blat de la Marina", "Gran trenza de brioche rellena", "Chapata"]
    },

    dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
  };
})();
