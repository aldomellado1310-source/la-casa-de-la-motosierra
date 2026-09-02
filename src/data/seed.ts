// ============================================================
// ARCHIVO GENERADO por scripts/importar-inventario.ts — NO EDITAR A MANO.
// Fuente: scripts/datos/inventario.tsv
// Para regenerar: npm run importar-inventario
// ============================================================
import type { Categoria, Producto } from '../types';

export const CATEGORIAS_SEED: Categoria[] = [
  {
    "id": "motosierras",
    "nombre": "Motosierras",
    "slug": "motosierras",
    "subcategorias": [
      "Profesionales",
      "Semi-profesionales",
      "Domésticas"
    ],
    "orden": 1
  },
  {
    "id": "desbrozadoras",
    "nombre": "Desbrozadoras/Orilladoras",
    "slug": "desbrozadoras",
    "subcategorias": [
      "Desbrozadoras",
      "Orilladoras",
      "Accesorios de corte"
    ],
    "orden": 2
  },
  {
    "id": "espadas-cadenas",
    "nombre": "Espadas y Cadenas",
    "slug": "espadas-cadenas",
    "subcategorias": [
      "Cadenas",
      "Espadas",
      "Piñones"
    ],
    "orden": 3
  },
  {
    "id": "filtros-bujias",
    "nombre": "Filtros y Bujías",
    "slug": "filtros-bujias",
    "subcategorias": [
      "Filtros de aire",
      "Filtros de combustible",
      "Bujías"
    ],
    "orden": 4
  },
  {
    "id": "carburacion-arranque",
    "nombre": "Carburación y Arranque",
    "slug": "carburacion-arranque",
    "subcategorias": [
      "Carburadores",
      "Kits de reparación",
      "Arranque"
    ],
    "orden": 5
  },
  {
    "id": "aceites-lubricantes",
    "nombre": "Aceites y Lubricantes",
    "slug": "aceites-lubricantes",
    "subcategorias": [
      "Aceite de mezcla 2T",
      "Aceite de cadena",
      "Grasas"
    ],
    "orden": 6
  },
  {
    "id": "herramientas-seguridad",
    "nombre": "Herramientas y Seguridad",
    "slug": "herramientas-seguridad",
    "subcategorias": [
      "Afilado",
      "EPP",
      "Herramientas"
    ],
    "orden": 7
  },
  {
    "id": "repuestos-varios",
    "nombre": "Repuestos Varios",
    "slug": "repuestos-varios",
    "subcategorias": [
      "Pistones y cilindros",
      "Embragues",
      "Otros"
    ],
    "orden": 8
  }
];

/** Marcas de máquinas soportadas por el buscador de compatibilidad */
export const MARCAS_MAQUINA = ["Stihl","Husqvarna","Honda","Toyama","Echo","Castor","Genérica/China"] as const;

export const PRODUCTOS_SEED: Producto[] = [
  {
    "id": "inv-c222",
    "sku": "C222",
    "nombre": "C222",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 45000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C222"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 45000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 40000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-golilla-fs-120",
    "sku": "GOLILLA FS 120",
    "nombre": "GOLILLA FS 120",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 10000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=GOLILLA%20FS%20120"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 10000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-protector-facial-con",
    "sku": "PROTECTOR FACIAL CON",
    "nombre": "PROTECTOR FACIAL CON",
    "descripcion": "",
    "categoria": "herramientas-seguridad",
    "subcategoria": "EPP",
    "precio": 15000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PROTECTOR%20FACIAL%20CON"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 15000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-manilla-hqv-61-268",
    "sku": "MANILLA HQV 61 268",
    "nombre": "MANILLA HQV 61 268",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 25000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MANILLA%20HQV%2061%20268"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 25000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-580",
    "sku": "580",
    "nombre": "SALVAMANO MS310-390-260",
    "descripcion": "",
    "categoria": "herramientas-seguridad",
    "subcategoria": "EPP",
    "precio": 20000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=580"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 20000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-368286",
    "sku": "368286",
    "nombre": "ACEITE 10W30",
    "descripcion": "",
    "categoria": "aceites-lubricantes",
    "subcategoria": "Grasas",
    "precio": 12000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=368286"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 12000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-6",
    "sku": "6",
    "nombre": "ACEITE CADENA",
    "descripcion": "",
    "categoria": "aceites-lubricantes",
    "subcategoria": "Aceite de cadena",
    "precio": 1500,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=6"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 1500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-980",
    "sku": "980",
    "nombre": "ACEITE MEZCLA ANTEROS 125CC",
    "descripcion": "",
    "categoria": "aceites-lubricantes",
    "subcategoria": "Aceite de mezcla 2T",
    "precio": 2900,
    "stock": 76,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=980"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 2900
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 2400
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-1030",
    "sku": "1030",
    "nombre": "ACEITE MEZCLA ANTEROS 50CC",
    "descripcion": "",
    "categoria": "aceites-lubricantes",
    "subcategoria": "Aceite de mezcla 2T",
    "precio": 1700,
    "stock": 152,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=1030"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 1700
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 1200
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ac100",
    "sku": "AC100",
    "nombre": "ACELERADOR HQV61",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 10000,
    "stock": 8,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=AC100"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 9000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-q518100000",
    "sku": "Q518100000",
    "nombre": "ACELERADOR UNIVERSAL",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 25000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=Q518100000"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 25000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-am102",
    "sku": "AM102",
    "nombre": "AMORTIGUADOR 380-381-382-260 KIT",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 15000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=AM102"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 15000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 14000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-am103",
    "sku": "AM103",
    "nombre": "AMORTIGUADOR CORTO CHINO",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 7000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=AM103"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 7000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 6000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-am101",
    "sku": "AM101",
    "nombre": "AMORTIGUADOR KIT 360",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 15000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=AM101"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 15000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 14000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-503-520-048",
    "sku": "503 520 048",
    "nombre": "AMORTIGUADOR MOTO CHINA LARGO",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 8000,
    "stock": 14,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=503%20520%20048"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-4711100273466",
    "sku": "4711100273466",
    "nombre": "AMORTIGUADOR ST018-180-MS170-180",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 4500,
    "stock": 8,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=4711100273466"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 4500
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-a100",
    "sku": "A100",
    "nombre": "AMORTIGUADOR STIHL 361",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 10000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=A100"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 9000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ase011",
    "sku": "ASE011",
    "nombre": "ANILLO 38X1,2MM ST180",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 16000,
    "stock": 8,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=ASE011"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 16000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 15000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ann005",
    "sku": "ANN005",
    "nombre": "ANILLOS HQV372",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 18000,
    "stock": 5,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=ANN005"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-760",
    "sku": "760",
    "nombre": "AOLLADOR CASTOR GD520",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 320000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=760"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 320000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-560",
    "sku": "560",
    "nombre": "ARNES DESBROZADORA",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 20000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=560"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 20000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-avr103",
    "sku": "AVR103",
    "nombre": "AVR 186",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 65000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=AVR103"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 65000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 63000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-avr100",
    "sku": "AVR100",
    "nombre": "AVR 2K",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 40000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=AVR100"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-avr102",
    "sku": "AVR102",
    "nombre": "AVR 2K CURVO",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=AVR102"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-769144350120",
    "sku": "769144350120",
    "nombre": "AVR 400V 470",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 60000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=769144350120"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 60000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 58000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-avr105",
    "sku": "AVR105",
    "nombre": "AVR 450V 470 (5KW)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 68000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=AVR105"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 68000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 65000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-avr101",
    "sku": "AVR101",
    "nombre": "AVR REGENERADOR DE BATERIA",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 25000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=AVR101"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-a105",
    "sku": "A105",
    "nombre": "Anillo (STIHL210)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 18000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=A105"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 18000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-a101",
    "sku": "A101",
    "nombre": "Anillo 33x1,5 (Makita)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 19000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=A101"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 19000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-a103",
    "sku": "A103",
    "nombre": "Anillo 34x1,2 (FS85-38)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 15000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=A103"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 15000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 14000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ase020",
    "sku": "ASE020",
    "nombre": "Anillo 35x1,2 (FS120-160)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 15000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=ASE020"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 15000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 14000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ase004",
    "sku": "ASE004",
    "nombre": "Anillo 42,5x1,2 (STHL250)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 17000,
    "stock": 18,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=ASE004"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 17000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 16000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ase003",
    "sku": "ASE003",
    "nombre": "Anillo 42x1,2 (STIHL230)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 12000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=ASE003"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-a104",
    "sku": "A104",
    "nombre": "Anillo 44,7x1,2 (STIHL260)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 28000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=A104"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 28000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 26000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ase005",
    "sku": "ASE005",
    "nombre": "Anillo 47x1,2 (STIHL361)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 20000,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=ASE005"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 18000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ane019",
    "sku": "ANE019",
    "nombre": "Anillo 47x1,5 (STIHL310)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 25000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=ANE019"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ane021",
    "sku": "ANE021",
    "nombre": "Anillo 49x1,5 (STIHL390)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 18000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=ANE021"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ase012",
    "sku": "ASE012",
    "nombre": "Anillo 52x1,2 (380-381)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 20000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=ASE012"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 18000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-a102",
    "sku": "A102",
    "nombre": "Anillos 37X1,2 (170)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 17000,
    "stock": 8,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=A102"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 17000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 16000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ane011",
    "sku": "ANE011",
    "nombre": "Anillos 41x1,5 (Poulan)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 15000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=ANE011"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 15000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 14000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ase009",
    "sku": "ASE009",
    "nombre": "Anillos 48x1,2 (340)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 20000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=ASE009"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 20000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-62-65-520",
    "sku": "62 65 520",
    "nombre": "Anillos 52x1,5 (STIHLMS381-380)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 20000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=62%2065%20520"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 20000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ann003",
    "sku": "ANN003",
    "nombre": "Anillos Hqv 61",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 18000,
    "stock": 9,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=ANN003"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 16000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-avr104",
    "sku": "AVR104",
    "nombre": "Avr 6 Cables Uf350v 360f",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 60000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=AVR104"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 60000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 55000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-2",
    "sku": "2",
    "nombre": "BASE CILINDRO STIHL 250",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 12000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=2"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-b300",
    "sku": "B300",
    "nombre": "BBIMA ENCENDIDO ROBIN EY 20",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=B300"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 40000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-b105",
    "sku": "B105",
    "nombre": "BOBINA 310/360/260",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 40000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=B105"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-b110",
    "sku": "B110",
    "nombre": "BOBINA CASTOR BC415",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 25000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=B110"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-b103",
    "sku": "B103",
    "nombre": "BOBINA CHINA",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 45000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=B103"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 45000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 43000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-mey000",
    "sku": "MEY000",
    "nombre": "BOBINA ELECTRONICA PLUSS (YAMATO) MS361",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 45000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MEY000"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 45000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 43000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-boy001",
    "sku": "BOY001",
    "nombre": "BOBINA ELECTRONICA PLUSS 61-268-272",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 45000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=BOY001"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 45000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 43000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-mey007",
    "sku": "MEY007",
    "nombre": "BOBINA ELECTRONICA PLUSS FS 38/45",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 40000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MEY007"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-mey001",
    "sku": "MEY001",
    "nombre": "BOBINA ELECTRONICA PLUSS MS260-310-360-380-390",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 45000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MEY001"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 45000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 43000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-mey005",
    "sku": "MEY005",
    "nombre": "BOBINA FS120",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MEY005"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-b109",
    "sku": "B109",
    "nombre": "BOBINA GENERADOR CHINO",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 45000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=B109"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 45000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 43500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-b108",
    "sku": "B108",
    "nombre": "BOBINA MS180",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 40000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=B108"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-b104",
    "sku": "B104",
    "nombre": "BOBINA MS250",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=B104"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-b101",
    "sku": "B101",
    "nombre": "BOBINA MS361",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 45000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=B101"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 45000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 43000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-330",
    "sku": "330",
    "nombre": "BOBINA NAYLON DESBROZADORA MTS",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 300,
    "stock": 600,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=330"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 300
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-mey002",
    "sku": "MEY002",
    "nombre": "BOBINA PLUSS MS250-FS160-FS220",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MEY002"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-b100",
    "sku": "B100",
    "nombre": "BOBINA PLUSS MS260/381",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 45000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=B100"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 45000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 43000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ba101",
    "sku": "BA101",
    "nombre": "BOMA ACEITE MOTOSIERRA MS310-390",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 40000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=BA101"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ba110",
    "sku": "BA110",
    "nombre": "BOMBA ACEITE 070",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 15000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=BA110"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 15000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 13500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ba109",
    "sku": "BA109",
    "nombre": "BOMBA ACEITE 170-180-210-230-250",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 15000,
    "stock": 8,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=BA109"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 15000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 13000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-4710462421232",
    "sku": "4710462421232",
    "nombre": "BOMBA ACEITE BBT ST 036-MS360",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 38000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=4710462421232"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 38000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 36500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ba108",
    "sku": "BA108",
    "nombre": "BOMBA ACEITE CASTOR 5200-A73",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 30000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=BA108"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 30000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 28000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ba106",
    "sku": "BA106",
    "nombre": "BOMBA ACEITE HQV 350",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 35000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=BA106"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 35000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 32000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-503-268-013",
    "sku": "503 268 013",
    "nombre": "BOMBA ACEITE HQV 61",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 35000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=503%20268%20013"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 35000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 32000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ba105",
    "sku": "BA105",
    "nombre": "BOMBA ACEITE MOTOSIERRA 380",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 35000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=BA105"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 35000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 32500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ba102",
    "sku": "BA102",
    "nombre": "BOMBA ACEITE MOTOSIERRA MS260",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 45000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=BA102"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 45000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 43000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-4710462421447",
    "sku": "4710462421447",
    "nombre": "BOMBA ACEITE MOTOSIERRA MS361",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 45000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=4710462421447"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 45000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 43000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ba104",
    "sku": "BA104",
    "nombre": "BOMBA ACEITE MOTOSIERRA STIHL 360-",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 38000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=BA104"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 38000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 37000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ba100",
    "sku": "BA100",
    "nombre": "BOMBA ACEITE MOTOSIERRA SUPERSTEEL MS382",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=BA100"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ba107",
    "sku": "BA107",
    "nombre": "BOMBA ACEITE PARA MOTOSIERRA STIHL 310",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 35000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=BA107"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 35000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 32000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-m100",
    "sku": "M100",
    "nombre": "BOMBIN SUCCION",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 9000,
    "stock": 9,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=M100"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-7897707506064",
    "sku": "7897707506064",
    "nombre": "BUJIA MOTOR ESTACIONARIO CORTA",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Bujías",
    "precio": 12000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=7897707506064"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-bug001",
    "sku": "BUG001",
    "nombre": "BUJIA MOTOSIERRA/DESBROZADORA COMUN",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Bujías",
    "precio": 4500,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=BUG001"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 4500
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-87295175439",
    "sku": "87295175439",
    "nombre": "BUJIA NGK 2/T",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Bujías",
    "precio": 8000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=87295175439"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-7897707506354",
    "sku": "7897707506354",
    "nombre": "BUJIA NGK MOTOR ESTACIONARIO 4T",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Bujías",
    "precio": 8000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=7897707506354"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-7897707505500",
    "sku": "7897707505500",
    "nombre": "BUJIA NGK MOTOSIERRA",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Bujías",
    "precio": 4500,
    "stock": 18,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=7897707505500"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 4500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-7897707513857",
    "sku": "7897707513857",
    "nombre": "BUJIA NGK STHIL NUEVA",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Bujías",
    "precio": 13000,
    "stock": 6,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=7897707513857"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 13000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 12000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-bj100",
    "sku": "BJ100",
    "nombre": "BUJIA OREGON LARGA 2T",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Bujías",
    "precio": 8000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=BJ100"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-bug005",
    "sku": "BUG005",
    "nombre": "BUJIA PEQUEÑA PLUSS USO DESBROZADORA HQV120",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Bujías",
    "precio": 8000,
    "stock": 12,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=BUG005"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-310",
    "sku": "310",
    "nombre": "CABEZAL CON CADENA ORILLADORA CHINA",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 28000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=310"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 28000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-280",
    "sku": "280",
    "nombre": "CABEZAL FS220",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 28000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=280"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 28000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-290",
    "sku": "290",
    "nombre": "CABEZAL FS38",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 28000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=290"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 28000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-270",
    "sku": "270",
    "nombre": "CABEZAL FS85-120-250",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 300000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=270"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 300000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-110",
    "sku": "110",
    "nombre": "CABEZAL KEULE DESMALEZADORA CHINA VULKAN",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 28000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=110"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 28000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 27000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-90",
    "sku": "90",
    "nombre": "CABEZAL KEULE DESMALEZADORA HEAVY DUTY",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 28000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=90"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 28000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 27000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-80",
    "sku": "80",
    "nombre": "CABEZAL KEULE DESMALEZADORA HEAVY DUTY II",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 28000,
    "stock": 8,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=80"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 28000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 27000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-100",
    "sku": "100",
    "nombre": "CABEZAL KEULE DESMALEZADORA T25 HQV",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 28000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=100"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 28000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 27000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-9",
    "sku": "9",
    "nombre": "CABEZAL KEULE T 35",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 30000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=9"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 30000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-8",
    "sku": "8",
    "nombre": "CABEZAL KEULE T45 HQV",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 28000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=8"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 28000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-300",
    "sku": "300",
    "nombre": "CABEZAL ORILLADORA ELECTRICA",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 10000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=300"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 10000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pai001",
    "sku": "PAI001",
    "nombre": "CABLE BUJIA 1/2MTS",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 5000,
    "stock": 8,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PAI001"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c210",
    "sku": "C210",
    "nombre": "CABURADOR MOTOSIERRA CHINA 5200-5800",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 45000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C210"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 45000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c10",
    "sku": "C10",
    "nombre": "CADENA 25/D STIHL170",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Cadenas",
    "precio": 15000,
    "stock": 9,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C10"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 15000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 14000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c120",
    "sku": "C120",
    "nombre": "CADENA 26/D HQV61-268",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Cadenas",
    "precio": 25000,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C120"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 24000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c20",
    "sku": "C20",
    "nombre": "CADENA 27/D STIHL180-210",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Cadenas",
    "precio": 16500,
    "stock": 8,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C20"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 16500
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 15000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c70",
    "sku": "C70",
    "nombre": "CADENA 28/D 3/8E HQV120 ELECTRICA",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Cadenas",
    "precio": 18000,
    "stock": 9,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C70"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c30",
    "sku": "C30",
    "nombre": "CADENA 30/D STIHL230",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Cadenas",
    "precio": 18000,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C30"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c80",
    "sku": "C80",
    "nombre": "CADENA 33/D HQV235-236-120 CASTOR 4100",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Cadenas",
    "precio": 22000,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C80"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      },
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 22000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 21000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c40",
    "sku": "C40",
    "nombre": "CADENA 34/D 325 STIHL250",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Cadenas",
    "precio": 19000,
    "stock": 6,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C40"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 19000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 18000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c90",
    "sku": "C90",
    "nombre": "CADENA 36/D HQV440-445-450 CASTOR 52CC-CHINAS",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Cadenas",
    "precio": 22000,
    "stock": 9,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C90"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      },
      {
        "marca": "Castor",
        "modelos": []
      },
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 22000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 21000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c60",
    "sku": "C60",
    "nombre": "CADENA 36/D STIHL310-340-360-361-380-381-382-390",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Cadenas",
    "precio": 22000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C60"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 22000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 21000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c50",
    "sku": "C50",
    "nombre": "CADENA 37/D 325 STIHL260",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Cadenas",
    "precio": 24000,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C50"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 24000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c110",
    "sku": "C110",
    "nombre": "CADENA 39/D CASTOR",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Cadenas",
    "precio": 24000,
    "stock": 7,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C110"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 24000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-380",
    "sku": "380",
    "nombre": "CAJA DE ENGRANAJE 9 ESTRIAS",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=380"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 40000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-390",
    "sku": "390",
    "nombre": "CAJA ENGRANAJE STIHL FS120",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 70000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=390"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 70000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-400",
    "sku": "400",
    "nombre": "CAJA ENGRANAJE STIHL FS220",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 70000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=400"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 70000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-7512228",
    "sku": "7512228",
    "nombre": "CARBON GENERADOR 168F",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 2500,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=7512228"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 2500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-7512215",
    "sku": "7512215",
    "nombre": "CARBON GENERADOR 188F 5-8 KW",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 2500,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=7512215"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 2500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-carbones-generador",
    "sku": "CARBONES GENERADOR",
    "nombre": "CARBONES 168F",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 15000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=CARBONES%20GENERADOR"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 15000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-carbones-de-generado",
    "sku": "CARBONES DE GENERADO",
    "nombre": "CARBONES 5.8 KV",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 15000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=CARBONES%20DE%20GENERADO"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 15000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c219",
    "sku": "C219",
    "nombre": "CARBURADOR BAUKER",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 45000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C219"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 45000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c13-1128",
    "sku": "C13-1128",
    "nombre": "CARBURADOR BAUKER GX390",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 60000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C13-1128"
    ],
    "compatibilidades": [
      {
        "marca": "Honda",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 60000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 55000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c218",
    "sku": "C218",
    "nombre": "CARBURADOR CASTOR 4100",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C218"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 40000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c204",
    "sku": "C204",
    "nombre": "CARBURADOR DESMALEZADORA CHINA 26CC",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 50000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C204"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 50000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-131136",
    "sku": "131136",
    "nombre": "CARBURADOR DESMALEZADORA FS120",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 55000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=131136"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 55000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c108",
    "sku": "C108",
    "nombre": "CARBURADOR DESMALEZADORA HQV 128L",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 35000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C108"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 35000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 34000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c203",
    "sku": "C203",
    "nombre": "CARBURADOR DESMALEZADORA HQV 33CC",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 60000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C203"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 60000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-car033",
    "sku": "CAR033",
    "nombre": "CARBURADOR FS120-200-250 PLUSS",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 55000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=CAR033"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 55000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-814426830785",
    "sku": "814426830785",
    "nombre": "CARBURADOR HONDA",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 60000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=814426830785"
    ],
    "compatibilidades": [
      {
        "marca": "Honda",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 60000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c107",
    "sku": "C107",
    "nombre": "CARBURADOR HQV350",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 65000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C107"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 65000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 63000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c106",
    "sku": "C106",
    "nombre": "CARBURADOR HQV61",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 65000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C106"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 65000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 63000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c211",
    "sku": "C211",
    "nombre": "CARBURADOR MOTOSIERRA 236",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 45000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C211"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 45000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c212",
    "sku": "C212",
    "nombre": "CARBURADOR MOTOSIERRA 440",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 60000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C212"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 60000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c217",
    "sku": "C217",
    "nombre": "CARBURADOR MOTOSIERRA 445",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 55000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C217"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 55000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c215",
    "sku": "C215",
    "nombre": "CARBURADOR MOTOSIERRA HQV 120",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 35000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C215"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 35000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c216",
    "sku": "C216",
    "nombre": "CARBURADOR MOTOSIERRA MS180 TIPO ZAMA ANBA",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 38000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C216"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c214",
    "sku": "C214",
    "nombre": "CARBURADOR MOTOSIERRA MS260 TIPO ZAMA",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 70000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C214"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 70000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c220",
    "sku": "C220",
    "nombre": "CARBURADOR MOTOSIERRA MS310 TIPO WALBRO",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 60000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C220"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 60000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c213",
    "sku": "C213",
    "nombre": "CARBURADOR MOTOSIERRA MS360",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 70000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C213"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 70000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c207",
    "sku": "C207",
    "nombre": "CARBURADOR MOTOSIERRA MS361",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 60000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C207"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 60000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c209",
    "sku": "C209",
    "nombre": "CARBURADOR MOTOSIERRA MS381",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 45000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C209"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 45000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c208",
    "sku": "C208",
    "nombre": "CARBURADOR MOTOSIERRA MS382",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 60000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C208"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 60000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-131110",
    "sku": "131110",
    "nombre": "CARBURADOR ORILLADORA FS38",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 35000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=131110"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 35000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-5901234123457",
    "sku": "5901234123457",
    "nombre": "CARBURADOR RAISMAN (210-230-250)",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 38000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=5901234123457"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c200",
    "sku": "C200",
    "nombre": "CARBURADOR RAISMAN 42CC",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 40000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C200"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 40000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c201",
    "sku": "C201",
    "nombre": "CARBURADOR RAISMAN STIHL 170-180",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 38000,
    "stock": 11,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C201"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-620",
    "sku": "620",
    "nombre": "CARBURADOR WALBRO 361",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 60000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=620"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 60000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-770",
    "sku": "770",
    "nombre": "CEBADOR CARBURADOR GRANDE",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 8000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=770"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-771",
    "sku": "771",
    "nombre": "CEBADOR CHICO",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 5000,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=771"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 5000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-240",
    "sku": "240",
    "nombre": "CILINDRO KIT PARA PISTON H61",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 75000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=240"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 75000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-251",
    "sku": "251",
    "nombre": "CILINDRO MS 361",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 70000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=251"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 70000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-260",
    "sku": "260",
    "nombre": "CILINDRO MS260",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 60000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=260"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 60000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-230",
    "sku": "230",
    "nombre": "CILINDRO PISTON ST-MS210",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 70000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=230"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 70000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 65000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-250",
    "sku": "250",
    "nombre": "CILINDRO PISTON ST-MS310",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 70000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=250"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 70000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-503-235-040",
    "sku": "503 235 040",
    "nombre": "CINTA DE FRENO MOTOSIERRA RAISMAN HQV236-235",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 8000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=503%20235%20040"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-503-361-059",
    "sku": "503 361 059",
    "nombre": "CINTA FRENO RAISMAN STIHL MS361",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 10000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=503%20361%20059"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 9000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c101",
    "sku": "C101",
    "nombre": "CODO ADMISION STIHL 210-230-250",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 10000,
    "stock": 5,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C101"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c100",
    "sku": "C100",
    "nombre": "CODO ADMISOR 260",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 10000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C100"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c105",
    "sku": "C105",
    "nombre": "CODO FS160-220-250",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 10000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C105"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c103",
    "sku": "C103",
    "nombre": "CODO STIHL 170-180",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 10000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C103"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c104",
    "sku": "C104",
    "nombre": "CODO STIHL 310-390",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 10000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C104"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-c102",
    "sku": "C102",
    "nombre": "CODO STIHL 361",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 10000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=C102"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-750",
    "sku": "750",
    "nombre": "CORTADOR DE CETOS CASTOR",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 220000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=750"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 220000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ra108",
    "sku": "RA108",
    "nombre": "CUARDA DE ARRANQUE HQV 445",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 9000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RA108"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-70",
    "sku": "70",
    "nombre": "CUCHILLA CORTA CESPED KEULE",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 30000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=70"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 30000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-160",
    "sku": "160",
    "nombre": "CUCHILLA KEULE 12 PODADOR LITUNA",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 30000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=160"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 30000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ra110",
    "sku": "RA110",
    "nombre": "CUERDA DE ARRANQUE STIHL FS38",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 10000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RA110"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pac013",
    "sku": "PAC013",
    "nombre": "CUERDA DE PARTIDA FS220-250",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 10000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PAC013"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pac009",
    "sku": "PAC009",
    "nombre": "CUERDA DE PARTIDA ORILLADORA/DESBROSADORA STIHL",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 9000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PAC009"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-h43001",
    "sku": "H43001",
    "nombre": "CUERDA DE PARTIDA PLUSS HQV 143",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 13000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=H43001"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 13000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 12000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ra109",
    "sku": "RA109",
    "nombre": "CUERDA DE PARTIDA STIHL 180/170/210/250/361",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 9000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RA109"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-cp100",
    "sku": "CP100",
    "nombre": "CUERDA PARTIDA MS260",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 12000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=CP100"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 10500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pac005",
    "sku": "PAC005",
    "nombre": "CUERDA PARTIDA PLUSS STIHL MS361",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 10000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PAC005"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pac011",
    "sku": "PAC011",
    "nombre": "CUERDAS DE PARTIDA PLUSS HQV 120-235-236",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 15000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PAC011"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 15000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 13500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-271",
    "sku": "271",
    "nombre": "Cabezal Fs 45 Stihl",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 30000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=271"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 30000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-cardan-lexible-para",
    "sku": "CARDAN LEXIBLE PARA",
    "nombre": "Cardan Flexible Fs 38",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 25000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=CARDAN%20LEXIBLE%20PARA"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 25000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-cardan-flexiblefs55",
    "sku": "CARDAN FLEXIBLEFS55",
    "nombre": "Cardan Flexible Fs 55",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 25000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=CARDAN%20FLEXIBLEFS55"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 25000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-clip",
    "sku": "CLIP",
    "nombre": "Clip Chico D Piñon",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 5000,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=CLIP"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 5000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-740",
    "sku": "740",
    "nombre": "DESMALEZADORA CASTOR BC260",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 172000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=740"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 172000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-720",
    "sku": "720",
    "nombre": "DESMALEZADORA CASTOR BC415",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 200000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=720"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 200000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-730",
    "sku": "730",
    "nombre": "DESMALEZADORA CASTOR BC508",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 279000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=730"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 279000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-710",
    "sku": "710",
    "nombre": "DESMALEZADORA CASTOR WBC508 C/RUEDA 253",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 259000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=710"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 259000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-680",
    "sku": "680",
    "nombre": "DESMALEZADORA PLUSS P52",
    "descripcion": "",
    "categoria": "herramientas-seguridad",
    "subcategoria": "Afilado",
    "precio": 150000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=680"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 150000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-690",
    "sku": "690",
    "nombre": "DESMALEZADORA TIGER T52",
    "descripcion": "",
    "categoria": "herramientas-seguridad",
    "subcategoria": "Afilado",
    "precio": 140000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=690"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 140000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-30",
    "sku": "30",
    "nombre": "DIAGNOSTICO",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 15000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=30"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 15000
      }
    ],
    "destacado": false,
    "activo": false,
    "bajoPedido": false
  },
  {
    "id": "inv-530",
    "sku": "530",
    "nombre": "DISCO 3 PUNTAS DESMALEZADORA",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 18000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=530"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 18000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-520",
    "sku": "520",
    "nombre": "DISCO DESMALEZADORA CHINA 59D",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 30000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=520"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 30000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-540",
    "sku": "540",
    "nombre": "DISCO PLUSS DESMALEZADORA",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 35000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=540"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 35000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-3",
    "sku": "3",
    "nombre": "EJE DE FUERZA ORILLADOR FS38",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 28000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=3"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 28000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 27000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-bj101",
    "sku": "BJ101",
    "nombre": "EJE DE INTERRUPTOR MOTOSIERRA STIHL MS250",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de combustible",
    "precio": 10000,
    "stock": 5,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=BJ101"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 9000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-e104",
    "sku": "E104",
    "nombre": "EMBRAGUE 170-180-210-230-250",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 15000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=E104"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 15000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 13000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-e109",
    "sku": "E109",
    "nombre": "EMBRAGUE 250",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 15000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=E109"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 15000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 14000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-e105",
    "sku": "E105",
    "nombre": "EMBRAGUE CASTOR",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 35000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=E105"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 35000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 33000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-e100",
    "sku": "E100",
    "nombre": "EMBRAGUE CHINO",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 15000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=E100"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 15000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 13500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-4710562341881",
    "sku": "4710562341881",
    "nombre": "EMBRAGUE COMPLETO HQV 61",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 18000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=4710562341881"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-4710792769745",
    "sku": "4710792769745",
    "nombre": "EMBRAGUE COMPLETO ST 038",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 18000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=4710792769745"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-e103",
    "sku": "E103",
    "nombre": "EMBRAGUE DEMALEZADORA CHINA",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 18000,
    "stock": 5,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=E103"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-e108",
    "sku": "E108",
    "nombre": "EMBRAGUE DESBROZADORA",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 18000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=E108"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-e101",
    "sku": "E101",
    "nombre": "EMBRAGUE DESBROZADORA SUPERSTEEL 430-520CC",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 18000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=E101"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-e102",
    "sku": "E102",
    "nombre": "EMBRAGUE DESMALEZADORA SUPERSTEEL KMT CHINO",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 18000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=E102"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-e113",
    "sku": "E113",
    "nombre": "EMBRAGUE HIGH QUALITY 43CC 52CC",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 18000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=E113"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-e114",
    "sku": "E114",
    "nombre": "EMBRAGUE HQV61",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 18000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=E114"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-e110",
    "sku": "E110",
    "nombre": "EMBRAGUE ORILLADORA CHINA",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 20000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=E110"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 19000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-505-199-8081",
    "sku": "505 199 8081",
    "nombre": "EMBRAGUE RAISMAN HQV 236-235",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 12000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=505%20199%208081"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 10000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-e106",
    "sku": "E106",
    "nombre": "EMBRAGUE STIHL 260",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 20000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=E106"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 18500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-e112",
    "sku": "E112",
    "nombre": "EMBRAGUE STIHL361",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 25000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=E112"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-e111",
    "sku": "E111",
    "nombre": "EMBRAGUE SUPERSTEEL STIHL MS 310",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 20000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=E111"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 18000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-e107",
    "sku": "E107",
    "nombre": "EMBRAGUE SUPERSTEEL STIHL MS382",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 18000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=E107"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-50-10715",
    "sku": "50-10715",
    "nombre": "EMGRANAJE PARA DESMALEZADORA CHINA",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 1000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=50-10715"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 1000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-780",
    "sku": "780",
    "nombre": "EMPAQUETADORAS DESMALEZADORA CHINA 33CC",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 12000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=780"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-820",
    "sku": "820",
    "nombre": "EMPAQUETADURA COMPLETA HQV 61-268",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 20000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=820"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 19000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-860",
    "sku": "860",
    "nombre": "EMPAQUETADURA HQV 235-236",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 5000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=860"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-830",
    "sku": "830",
    "nombre": "EMPAQUETADURA HQV 350",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 10000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=830"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 9000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-840",
    "sku": "840",
    "nombre": "EMPAQUETADURA HQV 61-268",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 10000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=840"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 9000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-em100",
    "sku": "EM100",
    "nombre": "EMPAQUETADURA HQV FS128",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 20000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=EM100"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      },
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 18000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-503-381-047",
    "sku": "503 381 047",
    "nombre": "EMPAQUETADURA RAISMAN STIHL MS381-38",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 8000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=503%20381%20047"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-851",
    "sku": "851",
    "nombre": "EMPAQUETADURA STHIL 361",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 10000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=851"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-810",
    "sku": "810",
    "nombre": "EMPAQUETADURA STIHL 260",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 8000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=810"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-790",
    "sku": "790",
    "nombre": "EMPAQUETADURA STIHL 360-340",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 20000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=790"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 19000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-800",
    "sku": "800",
    "nombre": "EMPAQUETADURA STIHL 382",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 10000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=800"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 9000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-850",
    "sku": "850",
    "nombre": "EMPAQUETADURA STIHL CARBURADOR/ESCAPE 210-230-250",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 5000,
    "stock": 13,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=850"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-805232109350",
    "sku": "805232109350",
    "nombre": "ENGRANAJE+SINFIN HQV288",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 10000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=805232109350"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 10000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-50",
    "sku": "50",
    "nombre": "ENGRASE CAJA DE ENGRANAJE",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 8000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=50"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": false,
    "bajoPedido": false
  },
  {
    "id": "inv-951",
    "sku": "951",
    "nombre": "ESCAPE 310 390",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 45000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=951"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 45000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-960",
    "sku": "960",
    "nombre": "ESCAPE HQV 61",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 35000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=960"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 35000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-cce016",
    "sku": "CCE016",
    "nombre": "ESCAPE PLUSS MS170-180",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 25000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=CCE016"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 24000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-cce004",
    "sku": "CCE004",
    "nombre": "ESCAPE PLUSS MS250-025-021",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 25000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=CCE004"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 24000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-930",
    "sku": "930",
    "nombre": "ESCAPE STIHL MS260",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 30000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=930"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 30000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 29000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-920",
    "sku": "920",
    "nombre": "ESCAPE STIHL MS360",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 35000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=920"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 35000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 34000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-940",
    "sku": "940",
    "nombre": "ESCAPE STIHL MS361",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 35000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=940"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 35000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-950",
    "sku": "950",
    "nombre": "ESCAPE STIHL MS381",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 35000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=950"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 35000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-201",
    "sku": "201",
    "nombre": "ESPADA BOLIN PARA 36 DIENTES",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 30000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=201"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 30000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-190",
    "sku": "190",
    "nombre": "ESPADA HQV236",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 35000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=190"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 35000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-120",
    "sku": "120",
    "nombre": "ESPADA KEULE 18 MOTOSIERRA STIHL 250",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 38000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=120"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-150",
    "sku": "150",
    "nombre": "ESPADA KEULE 20 STIHL 310-340-360-361-380-381-382-390",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 40000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=150"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 40000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-170",
    "sku": "170",
    "nombre": "ESPADA OREGON CASTOR 598",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 45000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=170"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 45000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-2010",
    "sku": "2010",
    "nombre": "ESPADA PARA HQV 445 440",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=2010"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 40000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-180",
    "sku": "180",
    "nombre": "ESPADA PLUSS 14 STIHL 170",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 30000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=180"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 30000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-130",
    "sku": "130",
    "nombre": "ESPADA PLUSS 16 STIHL 210",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 35000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=130"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 35000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-220",
    "sku": "220",
    "nombre": "ESPADA PLUSS HQV61-357 OLEOMAC 956",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=220"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 40000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-140",
    "sku": "140",
    "nombre": "ESPADA PLUSS POULAN/BAUKER/MAKITA/CHINA",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 30000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=140"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 30000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-200",
    "sku": "200",
    "nombre": "ESPADA TIGER CHINA",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 25000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=200"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 25000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-eje-desbrosadora-fs",
    "sku": "EJE DESBROSADORA FS",
    "nombre": "Eje Desbrozadora Fs 120",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 20000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=EJE%20DESBROSADORA%20FS"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 20000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-fl101",
    "sku": "FL101",
    "nombre": "FILTRO BENCINA ORIGINAL DELGADO STIHL",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de combustible",
    "precio": 4500,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=FL101"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 4500
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-caf003",
    "sku": "CAF003",
    "nombre": "FILTRO BENCINA PLUSS POREX ORIGINAL",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de combustible",
    "precio": 4500,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=CAF003"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 4500
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-fl100",
    "sku": "FL100",
    "nombre": "FILTRO BENCINA RAISMAN BOCA PEQUEÑA",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de combustible",
    "precio": 4500,
    "stock": 12,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=FL100"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 4500
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f100",
    "sku": "F100",
    "nombre": "FILTRO DE AIRE 172-182",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 1000,
    "stock": 6,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F100"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 1000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 800
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f105",
    "sku": "F105",
    "nombre": "FILTRO DE AIRE 310-390",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 12000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F105"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f116",
    "sku": "F116",
    "nombre": "FILTRO DE AIRE CASTOR 4100",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 6000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F116"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 6000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 5000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f106",
    "sku": "F106",
    "nombre": "FILTRO DE AIRE CASTOR VC508",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 10000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F106"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 9000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f107",
    "sku": "F107",
    "nombre": "FILTRO DE AIRE CHINO",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 10000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F107"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 9000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f109",
    "sku": "F109",
    "nombre": "FILTRO DE AIRE FS120-200-250",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 10000,
    "stock": 13,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F109"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 9000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f110",
    "sku": "F110",
    "nombre": "FILTRO DE AIRE FS28-45-55",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 7000,
    "stock": 8,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F110"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 7000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 6000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f118",
    "sku": "F118",
    "nombre": "FILTRO DE AIRE HQV 128L",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 4500,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F118"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 4500
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f108",
    "sku": "F108",
    "nombre": "FILTRO DE AIRE HQV 350",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 12000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F108"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f121",
    "sku": "F121",
    "nombre": "FILTRO DE AIRE HQV 361-365-372",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 12000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F121"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f103",
    "sku": "F103",
    "nombre": "FILTRO DE AIRE HQV 440",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 12000,
    "stock": 7,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F103"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f104",
    "sku": "F104",
    "nombre": "FILTRO DE AIRE HQV 450-445",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 12000,
    "stock": 7,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F104"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f120",
    "sku": "F120",
    "nombre": "FILTRO DE AIRE HQV 61",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 12000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F120"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f111",
    "sku": "F111",
    "nombre": "FILTRO DE AIRE HQV120 CHICA",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 12000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F111"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f112",
    "sku": "F112",
    "nombre": "FILTRO DE AIRE HQV236-235-120",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 5000,
    "stock": 6,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F112"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f119",
    "sku": "F119",
    "nombre": "FILTRO DE AIRE HQV372-365",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 16000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F119"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 16000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 15000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f113",
    "sku": "F113",
    "nombre": "FILTRO DE AIRE MOTOSIERRA CHINA CORTO",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 10000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F113"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 9000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f114",
    "sku": "F114",
    "nombre": "FILTRO DE AIRE MOTOSIERRA CHINA LARGO",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 10000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F114"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 9000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f102",
    "sku": "F102",
    "nombre": "FILTRO DE AIRE STIHL 170-180",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 4500,
    "stock": 18,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F102"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 4500
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f115",
    "sku": "F115",
    "nombre": "FILTRO DE AIRE STIHL 260",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 12000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F115"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f117",
    "sku": "F117",
    "nombre": "FILTRO DE AIRE STIHL210-230-250",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 8000,
    "stock": 14,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F117"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f101",
    "sku": "F101",
    "nombre": "FILTRO DE AIRE STIL361",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 12000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F101"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-fl-116",
    "sku": "FL 116",
    "nombre": "FILTRO DE AIRES MS 360",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 12000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=FL%20116"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 12000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f140",
    "sku": "F140",
    "nombre": "FILTRO DE COMBUSTIBLE MOTOR 186F C/LLAVE DE PASO",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de combustible",
    "precio": 35000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F140"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 35000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-f130",
    "sku": "F130",
    "nombre": "FILTRO DE COMBUSTIBLE MOTOR 186F C/LLAVE DE PASO REEMPLAZO",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de combustible",
    "precio": 10000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=F130"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 10000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-5",
    "sku": "5",
    "nombre": "FILTRO PETROLEO",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de combustible",
    "precio": 12000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=5"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-4",
    "sku": "4",
    "nombre": "FILTRO PETROLEO SUPERSTEEL 178-188-192F",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de combustible",
    "precio": 12000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=4"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-caf007",
    "sku": "CAF007",
    "nombre": "FILTROS BENCINA PLUSS GRUESO STIHL",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de combustible",
    "precio": 4500,
    "stock": 23,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=CAF007"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 4500
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-filto-de-aire",
    "sku": "FILTO DE AIRE",
    "nombre": "Filtri De Aire Chino",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de aire",
    "precio": 8000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=FILTO%20DE%20AIRE"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-fl115",
    "sku": "FL115",
    "nombre": "Filtro De Bencina Chino",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de combustible",
    "precio": 4500,
    "stock": 9,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=FL115"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 4500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-b102",
    "sku": "B102",
    "nombre": "GORRO BUJIA MOTOSIERRA C/STIHL",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 5000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=B102"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-b107",
    "sku": "B107",
    "nombre": "GORRO BUJIA RAISMAN+CABLE 30CM",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 5000,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=B107"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pau001",
    "sku": "PAU001",
    "nombre": "GORRO BUJIA STIHL C/RESORTE",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 5000,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PAU001"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-5400182076636",
    "sku": "5400182076636",
    "nombre": "GUANTES OREGON",
    "descripcion": "",
    "categoria": "herramientas-seguridad",
    "subcategoria": "EPP",
    "precio": 20000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=5400182076636"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 20000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-g100",
    "sku": "G100",
    "nombre": "GUARDAPOLVO HQV61",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 3000,
    "stock": 6,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=G100"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 3000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 2000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-b106",
    "sku": "B106",
    "nombre": "INTERRUPTOR 61-236",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 5000,
    "stock": 8,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=B106"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-i1",
    "sku": "I1",
    "nombre": "INTERRUPTOR MOTOR ESTACIONARIO",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 5000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=I1"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-503-520-185",
    "sku": "503 520 185",
    "nombre": "INTERRUPTOR RAISMAN MOTOSIERRA CHINA",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 5000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=503%20520%20185"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-interuptor",
    "sku": "INTERUPTOR",
    "nombre": "Interuptor Dos Pines",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 6000,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=INTERUPTOR"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 6000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-am100",
    "sku": "AM100",
    "nombre": "KIT AMORTIGUADOR MS381-382",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 15000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=AM100"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 15000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-m103",
    "sku": "M103",
    "nombre": "KIT DE MEMBRANA POULAN-2150 HQV136",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 18000,
    "stock": 8,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=M103"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-m102",
    "sku": "M102",
    "nombre": "KIT MEMBRANA 250ANTIGUA-260-CHINA",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 18000,
    "stock": 18,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=M102"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 16000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-7hh800434",
    "sku": "7HH800434",
    "nombre": "KIT MEMBRANA HONDA-MITSUBISHI-CHINA",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 20000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=7HH800434"
    ],
    "compatibilidades": [
      {
        "marca": "Honda",
        "modelos": []
      },
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 18000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-m101",
    "sku": "M101",
    "nombre": "KIT MEMBRANA MOTOSIERRA 210-230-250 ZAMA",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 17000,
    "stock": 6,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=M101"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 17000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 16000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-805232079608",
    "sku": "805232079608",
    "nombre": "KIT REPARACIÓN CARBURADOR BRIGGS & STRATTON 394698",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Carburadores",
    "precio": 6000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=805232079608"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 6000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 5000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-7",
    "sku": "7",
    "nombre": "LIMA DE MOTO 310",
    "descripcion": "",
    "categoria": "herramientas-seguridad",
    "subcategoria": "Afilado",
    "precio": 2000,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=7"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 2000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-5400182008231",
    "sku": "5400182008231",
    "nombre": "LIMA PLANA OREGON 6",
    "descripcion": "",
    "categoria": "herramientas-seguridad",
    "subcategoria": "Afilado",
    "precio": 3500,
    "stock": 72,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=5400182008231"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 3500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-630",
    "sku": "630",
    "nombre": "LIMA PLANA OREGON 8",
    "descripcion": "",
    "categoria": "herramientas-seguridad",
    "subcategoria": "Afilado",
    "precio": 5500,
    "stock": 7,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=630"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 5500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-640",
    "sku": "640",
    "nombre": "LIMA REDONDA KEULE 3/16 MEDIANA",
    "descripcion": "",
    "categoria": "herramientas-seguridad",
    "subcategoria": "Afilado",
    "precio": 2000,
    "stock": 36,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=640"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 2000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 1500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-660",
    "sku": "660",
    "nombre": "LIMA REDONDA KEULE 5/32 FINA",
    "descripcion": "",
    "categoria": "herramientas-seguridad",
    "subcategoria": "Afilado",
    "precio": 2000,
    "stock": 52,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=660"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 2000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 1500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-650",
    "sku": "650",
    "nombre": "LIMA REDONDA KEULE 7/32 GRUESA",
    "descripcion": "",
    "categoria": "herramientas-seguridad",
    "subcategoria": "Afilado",
    "precio": 2000,
    "stock": 34,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=650"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 2000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 1500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn113",
    "sku": "PÑ113",
    "nombre": "LLAVE BUJIA MOTOR ESTACIONARIO",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 8000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91113"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 5000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn112",
    "sku": "PÑ112",
    "nombre": "LLAVE BUJIA PUNTA ESTRELLA",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 6000,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91112"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 6000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 5000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn111",
    "sku": "PÑ111",
    "nombre": "LLAVE DE BUJIA PALETA",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 6000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91111"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 6000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 5000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-mp100",
    "sku": "MP100",
    "nombre": "MANGO DE LIMA",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 1000,
    "stock": 5,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MP100"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 1000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-4710562340709",
    "sku": "4710562340709",
    "nombre": "MANGO DE PARTIDA HQV",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 4000,
    "stock": 26,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=4710562340709"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 4000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 3000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-370",
    "sku": "370",
    "nombre": "MANGO MANILLAR MOTO STIHL 380",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 15000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=370"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 15000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-360",
    "sku": "360",
    "nombre": "MANGO MANILLAR MOTO STIHL361",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 15000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=360"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 15000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-340",
    "sku": "340",
    "nombre": "MANGOS ACELERADOR AOLLADOR",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 25000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=340"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 25000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-350",
    "sku": "350",
    "nombre": "MANGOS ACELERADOR DESBROZADORA HQV/CHINA",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 30000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=350"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      },
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 30000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-mb106",
    "sku": "MB106",
    "nombre": "MANGUERA ACEITE STIHL MS260",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 5000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MB106"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-mb104",
    "sku": "MB104",
    "nombre": "MANGUERA ACEITE STIHL361",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 4000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MB104"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 4000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 3000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-mb100",
    "sku": "MB100",
    "nombre": "MANGUERA BENCINA CASTOR 038",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 8000,
    "stock": 5,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MB100"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-mb102",
    "sku": "MB102",
    "nombre": "MANGUERA BENCINA CASTOR STIHL MS250",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 8000,
    "stock": 6,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MB102"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      },
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-mb109",
    "sku": "MB109",
    "nombre": "MANGUERA BENCINA DESBROZADORA CHINA",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 10000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MB109"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 9000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-mb103",
    "sku": "MB103",
    "nombre": "MANGUERA BENCINA MOTO CHINA",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 5000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MB103"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-503-180-040",
    "sku": "503 180 040",
    "nombre": "MANGUERA BENCINA RAISMAN STIHL MS170-180",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 8000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=503%20180%20040"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-mb101",
    "sku": "MB101",
    "nombre": "MANGUERA BENCINA RAISMAN STIHL MS360-310-390",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 10000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MB101"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 9000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-503-361-036",
    "sku": "503 361 036",
    "nombre": "MANGUERA BENCINA RAISMAN STIHL MS361",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 8000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=503%20361%20036"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-mb105",
    "sku": "MB105",
    "nombre": "MANGUERA BENCINA STIHL MS381",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 5000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MB105"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-1610024",
    "sku": "1610024",
    "nombre": "MANGUERA DE BENCINA 2.5MM X 5MM",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 2000,
    "stock": 5,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=1610024"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 2000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-1610058",
    "sku": "1610058",
    "nombre": "MANGUERA DE BENCINA 2MM X 3.5MM",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 2000,
    "stock": 5,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=1610058"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 2000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-1610059",
    "sku": "1610059",
    "nombre": "MANGUERA DE BENCINA 3MM X 5MM",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 2000,
    "stock": 5,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=1610059"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 2000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-60",
    "sku": "60",
    "nombre": "MANO DE OBRA",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 15000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=60"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 15000
      }
    ],
    "destacado": false,
    "activo": false,
    "bajoPedido": false
  },
  {
    "id": "inv-40",
    "sku": "40",
    "nombre": "MANTENCION MOTOSIERRA",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 20000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=40"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 20000
      }
    ],
    "destacado": false,
    "activo": false,
    "bajoPedido": false
  },
  {
    "id": "inv-mem024",
    "sku": "MEM024",
    "nombre": "MEMBRANA MS 250 WALBRO",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 18000,
    "stock": 5,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MEM024"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 18000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-m113",
    "sku": "M113",
    "nombre": "MEMBRANA 361 WALBRO",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 18000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=M113"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-m109",
    "sku": "M109",
    "nombre": "MEMBRANA DESMALEZADORA FS120",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 18000,
    "stock": 6,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=M109"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-m108",
    "sku": "M108",
    "nombre": "MEMBRANA DESMALEZADORA VARIAS",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 18000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=M108"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-m107",
    "sku": "M107",
    "nombre": "MEMBRANA HQV128",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 18000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=M107"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-m104",
    "sku": "M104",
    "nombre": "MEMBRANA HQV445",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 25000,
    "stock": 5,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=M104"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-m105",
    "sku": "M105",
    "nombre": "MEMBRANA HQV61 WALBRO",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 25000,
    "stock": 9,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=M105"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-43-20-149",
    "sku": "43 20 149",
    "nombre": "MEMBRANA MOTOSIERRA RAISMAN HQV 236-235-120 MARKII",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 20000,
    "stock": 8,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=43%2020%20149"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 18000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-mem025",
    "sku": "MEM025",
    "nombre": "MEMBRANA PARA DEAMALEZADORA CHUNA",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 20000,
    "stock": 5,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MEM025"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 20000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-m106",
    "sku": "M106",
    "nombre": "MEMBRANA PLUSS TILLOTSON HQV61-268",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 25000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=M106"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-4310033",
    "sku": "4310033",
    "nombre": "MEMBRANA RAISMAN STIHL MS170 FS120-250",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 18000,
    "stock": 18,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=4310033"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-m115",
    "sku": "M115",
    "nombre": "MEMBRANA STIHL 034-36",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 18000,
    "stock": 7,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=M115"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-m110",
    "sku": "M110",
    "nombre": "MEMBRANA STIHL 070",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 25000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=M110"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-m112",
    "sku": "M112",
    "nombre": "MEMBRANA STIHL 381-380",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 30000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=M112"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 30000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 28500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-43-20-013",
    "sku": "43 20 013",
    "nombre": "MEMBRANA STIHL FS169-220-280",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 18000,
    "stock": 7,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=43%2020%20013"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-m114",
    "sku": "M114",
    "nombre": "MEMBRANA STIHL310-390",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 20000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=M114"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 19000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-mem023",
    "sku": "MEM023",
    "nombre": "MEMBRANA ZAMA170-180 STIHLMS120-250-350",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Kits de reparación",
    "precio": 18000,
    "stock": 14,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MEM023"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 17000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-700",
    "sku": "700",
    "nombre": "MOTOSIERRA CASTOR 5200",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 280000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=700"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 280000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-600",
    "sku": "600",
    "nombre": "MOTOSIERRA CASTOR 598",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 300000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=600"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 300000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-610",
    "sku": "610",
    "nombre": "MOTOSIERRA CASTOR TTYD55",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 400000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=610"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 400000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-670",
    "sku": "670",
    "nombre": "MOTOSIERRA PLUSS PRO380 52CC",
    "descripcion": "",
    "categoria": "herramientas-seguridad",
    "subcategoria": "Afilado",
    "precio": 165000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=670"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 165000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-mangerafs-38",
    "sku": "MANGERAFS 38",
    "nombre": "Manguera Orilladora Fs 38",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 12000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MANGERAFS%2038"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 12000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-manillar",
    "sku": "MANILLAR",
    "nombre": "Manillar Motosierra China 5200",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 20000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=MANILLAR"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 20000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-n-10",
    "sku": "N 10",
    "nombre": "NYLON 2.4",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 300,
    "stock": 80,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=N%2010"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 300
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-tr104",
    "sku": "TR104",
    "nombre": "PERNO CARBONO HQV61",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 5000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=TR104"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-tr103",
    "sku": "TR103",
    "nombre": "PERNO ESCAPE STIHL 170-180-210-230-250",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 8000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=TR103"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-tr101",
    "sku": "TR101",
    "nombre": "PERNO ESCAPE STIHL 310-390",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 8000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=TR101"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-emp003",
    "sku": "EMP003",
    "nombre": "PERNO TENSOR DE CADENA PLUSS 61-268-266",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 5000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=EMP003"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-320",
    "sku": "320",
    "nombre": "PIOLA ARRANQUE",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 1500,
    "stock": 147,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=320"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 1500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-p-107",
    "sku": "P 107",
    "nombre": "PISTON 390",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%20107"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 40000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-p113",
    "sku": "P113",
    "nombre": "PISTON CASTOR STIHL 038/MS381 (52MM)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 40000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P113"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      },
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pic024",
    "sku": "PIC024",
    "nombre": "PISTON CON ANILLO 017-170 (37MM)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 40000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PIC024"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 37500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pio010",
    "sku": "PIO010",
    "nombre": "PISTON CON ANILLO PLUSS HQV268",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 45000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PIO010"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 45000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 43000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-p101",
    "sku": "P101",
    "nombre": "PISTON FS55 (34MM)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 40000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P101"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 37500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pis107",
    "sku": "PIS107",
    "nombre": "PISTON MOTOSIERRA 45CC",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 25000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PIS107"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 25000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-503-520-013",
    "sku": "503 520 013",
    "nombre": "PISTON MOTOSIERRA CHINA (45X1,2MM)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 25000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=503%20520%20013"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-p109",
    "sku": "P109",
    "nombre": "PISTON MS180",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P109"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-p103",
    "sku": "P103",
    "nombre": "PISTON MS210 (40MM)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 45000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P103"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 45000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 43000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-p102",
    "sku": "P102",
    "nombre": "PISTON MS250 (42,5MM)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 40000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P102"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 37500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-p100",
    "sku": "P100",
    "nombre": "PISTON MS361 (47MM)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 40000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P100"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 37500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-p112",
    "sku": "P112",
    "nombre": "PISTON MS382 (52MM)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 50000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P112"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 50000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 48000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-p105",
    "sku": "P105",
    "nombre": "PISTON PLUSS FS 160",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P105"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-p104",
    "sku": "P104",
    "nombre": "PISTON PLUSS FS 85",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 40000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P104"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-p108",
    "sku": "P108",
    "nombre": "PISTON PLUSS FS120",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P108"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-p107",
    "sku": "P107",
    "nombre": "PISTON PLUSS FS220",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P107"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pio009",
    "sku": "PIO009",
    "nombre": "PISTON PLUSS HQV61",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 40000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PIO009"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-503-360-020",
    "sku": "503 360 020",
    "nombre": "PISTON RAISMAN STIHL MS360 (48MM)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 60000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=503%20360%20020"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 60000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 58000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-p111",
    "sku": "P111",
    "nombre": "PISTON SUPERSTEEL HUS435-440",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P111"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 38000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-p110",
    "sku": "P110",
    "nombre": "PISTON SUPERSTEEL MS260",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 50000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P110"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 50000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 48000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pic005",
    "sku": "PIC005",
    "nombre": "PISTONES CON ANILLOS MS310 (47MM) PLUSS",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 40000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PIC005"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 40000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 37500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-p114",
    "sku": "P114",
    "nombre": "PISTONES HQV372",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 35000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P114"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 35000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 33000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-p106",
    "sku": "P106",
    "nombre": "PISTONM RAISMAN STIHL MS360 (48MM)",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Pistones y cilindros",
    "precio": 50000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P106"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 50000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn106",
    "sku": "PÑ106",
    "nombre": "PIÑON 180",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 19000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91106"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 19000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 18000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn104",
    "sku": "PÑ104",
    "nombre": "PIÑON 260",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 25000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91104"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn117",
    "sku": "PÑ117",
    "nombre": "PIÑON 3/8 ESPECIAL 170-180-HQV",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 8000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91117"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn114",
    "sku": "PÑ114",
    "nombre": "PIÑON 3/8-7",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 8000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91114"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn115",
    "sku": "PÑ115",
    "nombre": "PIÑON 3/8-8",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 8000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91115"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn116",
    "sku": "PÑ116",
    "nombre": "PIÑON 325-7",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 8000,
    "stock": 20,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91116"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn118",
    "sku": "PÑ118",
    "nombre": "PIÑON COMPLETO HQV236-235-120",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 25000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91118"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-910",
    "sku": "910",
    "nombre": "PIÑON FLOTANTE 170-180",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 20000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=910"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 19000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn120",
    "sku": "PÑ120",
    "nombre": "PIÑON FLOTANTE 325/7",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 8000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91120"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn107",
    "sku": "PÑ107",
    "nombre": "PIÑON HQV 365",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 35000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91107"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 35000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 33000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn109",
    "sku": "PÑ109",
    "nombre": "PIÑON HQV 435",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 35000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91109"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 35000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 33000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn100",
    "sku": "PÑ100",
    "nombre": "PIÑON STIHL 250",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 20000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91100"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 18000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn105",
    "sku": "PÑ105",
    "nombre": "PIÑON STIHL 310-390",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 25000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91105"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-550",
    "sku": "550",
    "nombre": "PIÑON STIHL 361",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=550"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 40000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn102",
    "sku": "PÑ102",
    "nombre": "PIÑON SUPERSTEEL DESBROZADORA 7T",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 20000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91102"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 18500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn101",
    "sku": "PÑ101",
    "nombre": "PIÑON SUPERSTEEL HQV340-345",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 18000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91101"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 16000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn103",
    "sku": "PÑ103",
    "nombre": "PIÑON Y EMBRAGUE CASTOR 4100",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 20000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91103"
    ],
    "compatibilidades": [
      {
        "marca": "Castor",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 18500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn110",
    "sku": "PÑ110",
    "nombre": "PIÑONES FLOTANTES 3/8-7",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 8000,
    "stock": 5,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%91110"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pl1",
    "sku": "PL1",
    "nombre": "PLATINO STIHL 0/70",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 25000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PL1"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pl104",
    "sku": "PL104",
    "nombre": "POLEA DE PARTIDA 120-235-236",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 18000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PL104"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 18000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 16000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pl103",
    "sku": "PL103",
    "nombre": "POLEA DE PARTIDA MOTOSIERRA CHINA BAUKER",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 9000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PL103"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pl105",
    "sku": "PL105",
    "nombre": "POLEA DE PARTIDA MOTOSIERRA MS250",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 9000,
    "stock": 12,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PL105"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-4710792763828",
    "sku": "4710792763828",
    "nombre": "POLEA DE PARTIDA ST038",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 13000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=4710792763828"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 13000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 12000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pl100",
    "sku": "PL100",
    "nombre": "POLEA DE PARTIDA STIHL 170-180-210-230-250",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 9000,
    "stock": 12,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PL100"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pl101",
    "sku": "PL101",
    "nombre": "POLEA DE PARTIDA STIHL 260",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 9000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PL101"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-uuu243624001",
    "sku": "UUU243624001",
    "nombre": "POLEA MOTO CHINA 25CC",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 20000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=UUU243624001"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 18000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pl108",
    "sku": "PL108",
    "nombre": "POLEA MOTOSIERRA MS361-360-382-310",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 8000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PL108"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-porta-filtro",
    "sku": "PORTA FILTRO",
    "nombre": "PORTA FILTRO",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de combustible",
    "precio": 25000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PORTA%20FILTRO"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 25000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-1005",
    "sku": "1005",
    "nombre": "PORTAFILTRO",
    "descripcion": "",
    "categoria": "filtros-bujias",
    "subcategoria": "Filtros de combustible",
    "precio": 25000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=1005"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 25000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-10000",
    "sku": "10000",
    "nombre": "PULVERIZADORA MANUAL KEULE",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=10000"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 40000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pn110-2",
    "sku": "Pñ110",
    "nombre": "Piñon Flotante 310 390",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Piñones",
    "precio": 35000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=P%C3%B1110"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 35000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-tr102",
    "sku": "TR102",
    "nombre": "REGULADOR CADENA STIHL 170-180",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 5000,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=TR102"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-10",
    "sku": "10",
    "nombre": "REPARACIÓN CARBURADOR",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 25000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=10"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 25000
      }
    ],
    "destacado": false,
    "activo": false,
    "bajoPedido": false
  },
  {
    "id": "inv-20",
    "sku": "20",
    "nombre": "REPARACIÓN COMPLETA",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 50000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=20"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 50000
      }
    ],
    "destacado": false,
    "activo": false,
    "bajoPedido": false
  },
  {
    "id": "inv-ra103",
    "sku": "RA103",
    "nombre": "RESORTE DE ARRANQUE 61",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 9000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RA103"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ra111",
    "sku": "RA111",
    "nombre": "RESORTE DE ARRANQUE CHINA/BAUKER 52-58CC",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 9000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RA111"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ra112",
    "sku": "RA112",
    "nombre": "RESORTE DE ARRANQUE DESMALEZADORA HQV 128L",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 8000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RA112"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ra105",
    "sku": "RA105",
    "nombre": "RESORTE DE ARRANQUE KEULE",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 9000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RA105"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ra104",
    "sku": "RA104",
    "nombre": "RESORTE DE ARRANQUE MS260",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 12000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RA104"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ra101",
    "sku": "RA101",
    "nombre": "RESORTE DE ARRANQUE RAISMAN STIHL 070-08",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 8000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RA101"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ra100",
    "sku": "RA100",
    "nombre": "RESORTE DE ARRANQUE SUPERSTEEL 236",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 10000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RA100"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ra102",
    "sku": "RA102",
    "nombre": "RESORTE DE ARRANQUE SUPERSTEEL 450 SINGLE",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 12000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RA102"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ra106",
    "sku": "RA106",
    "nombre": "RESORTE DE ARRANQUE SUPERSTEEL HUS128",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 8000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RA106"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pl102",
    "sku": "PL102",
    "nombre": "RESORTE DE PARTIDA 236",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 8000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PL102"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-uuu0093061001",
    "sku": "UUU0093061001",
    "nombre": "RESORTE DE PARTIDA DESBROZADORA",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 8000,
    "stock": 5,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=UUU0093061001"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-143",
    "sku": "143",
    "nombre": "RESORTE DE PARTIDA HQV 143",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 8000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=143"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ra107",
    "sku": "RA107",
    "nombre": "RESORTE DE PARTIDA HQV 61",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 8000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RA107"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-609-430-061",
    "sku": "609 430 061",
    "nombre": "RESORTE DE PARTIDA RAISMAN (4MMX0,5MM)",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 9000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=609%20430%20061"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-4710462421324",
    "sku": "4710462421324",
    "nombre": "RESORTE DE PARTIDA ST-038-051",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 10000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=4710462421324"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 9000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-503-520-105",
    "sku": "503 520 105",
    "nombre": "RESORTE PARTIDA MOTOSIERRA BAUKER/CHINA 58CC",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 9000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=503%20520%20105"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-r103",
    "sku": "R103",
    "nombre": "RETEN 260-360 COMPLETO",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 20000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=R103"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 18000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-r104",
    "sku": "R104",
    "nombre": "RETEN 361 GRANDE",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 10000,
    "stock": 13,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=R104"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 9000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-r102",
    "sku": "R102",
    "nombre": "RETEN 361 PEQUEÑO",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 9000,
    "stock": 11,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=R102"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-r111",
    "sku": "R111",
    "nombre": "RETEN FS 120-200-250",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 6000,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=R111"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 6000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 5000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-r106",
    "sku": "R106",
    "nombre": "RETEN FS38",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 12000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=R106"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-r112",
    "sku": "R112",
    "nombre": "RETEN HQV 236",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 8000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=R112"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-r105",
    "sku": "R105",
    "nombre": "RETEN HQV 365-372",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 15000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=R105"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 15000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 13500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-r101",
    "sku": "R101",
    "nombre": "RETEN HQV 435-440",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 20000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=R101"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 18000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-r107",
    "sku": "R107",
    "nombre": "RETEN HQV 445",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 12000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=R107"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 10000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-r108",
    "sku": "R108",
    "nombre": "RETEN HQV 61-268",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 12000,
    "stock": 9,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=R108"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-r113",
    "sku": "R113",
    "nombre": "RETEN STIHL 038",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 8000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=R113"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-r109",
    "sku": "R109",
    "nombre": "RETEN STIHL 310-390",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 6000,
    "stock": 6,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=R109"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 6000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 5000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-r114",
    "sku": "R114",
    "nombre": "RETEN STIHL 381",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 20000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=R114"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 18500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-r110",
    "sku": "R110",
    "nombre": "RETEN STIHL 382",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 20000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=R110"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 18000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-r100",
    "sku": "R100",
    "nombre": "RETENES STIHL 170-180-210-230-250",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 12000,
    "stock": 19,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=R100"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 12000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 11000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-rodamiento",
    "sku": "RODAMIENTO",
    "nombre": "RODAMIENTO DE TAMBOR CHINO",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 6000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RODAMIENTO"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 6000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-739210357139",
    "sku": "739210357139",
    "nombre": "RODAMIENTO PFI STIHL MS380-381-310-390",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 7500,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=739210357139"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 7500
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 6500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-rd100",
    "sku": "RD100",
    "nombre": "RODAMIENTO ROGECA 6002",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 6000,
    "stock": 7,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RD100"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 6000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 5000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-rd103",
    "sku": "RD103",
    "nombre": "RODAMIENTO STIHL 170-180-210-230-250",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 5000,
    "stock": 7,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RD103"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-rd104",
    "sku": "RD104",
    "nombre": "RODAMIENTO TAMBOR STIHL MS380-381-038",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 5000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RD104"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-rd102",
    "sku": "RD102",
    "nombre": "RODAMIENTOS 361-310",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 8000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RD102"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-739210356989",
    "sku": "739210356989",
    "nombre": "RODAMIENTOS PFI 6202",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 7500,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=739210356989"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 7500
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 6500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-766143837509",
    "sku": "766143837509",
    "nombre": "RODAMIENTOS VARIOS",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 6000,
    "stock": 7,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=766143837509"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 6000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 5000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-radamento-tambor-361",
    "sku": "RADAMENTO TAMBOR 361",
    "nombre": "Rodamiento Tambor 361 Grueso",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 7000,
    "stock": 5,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=RADAMENTO%20TAMBOR%20361"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-570",
    "sku": "570",
    "nombre": "SALVAMANOS MS361",
    "descripcion": "",
    "categoria": "herramientas-seguridad",
    "subcategoria": "EPP",
    "precio": 20000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=570"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 20000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-590",
    "sku": "590",
    "nombre": "SALVAMANOS MS380",
    "descripcion": "",
    "categoria": "herramientas-seguridad",
    "subcategoria": "EPP",
    "precio": 20000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=590"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 20000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-1024",
    "sku": "1024",
    "nombre": "SEGURO TRINQUTE 038 380 STIHL",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 1000,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=1024"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 1000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-sf101",
    "sku": "SF101",
    "nombre": "SINFIN 170-180-210-230-250",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 9000,
    "stock": 13,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=SF101"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-sf103",
    "sku": "SF103",
    "nombre": "SINFIN 360-310",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 9000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=SF103"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-sf102",
    "sku": "SF102",
    "nombre": "SINFIN 361",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 9000,
    "stock": 9,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=SF102"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-sf106",
    "sku": "SF106",
    "nombre": "SINFIN 380-038",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 5000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=SF106"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-sf105",
    "sku": "SF105",
    "nombre": "SINFIN HQV 445",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 9000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=SF105"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-sf104",
    "sku": "SF104",
    "nombre": "SINFIN HQV 61-268",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 5000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=SF104"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-sf107",
    "sku": "SF107",
    "nombre": "SINFIN MOTOSIERRA CHINA",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 10000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=SF107"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 10000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 9000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-sf100",
    "sku": "SF100",
    "nombre": "SINFIN MOTOSIERRA MS180",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 9000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=SF100"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-pl107",
    "sku": "PL107",
    "nombre": "SISTEMA DE PARTIDA HQV",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 9000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=PL107"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 9000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 8000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-soporte",
    "sku": "SOPORTE",
    "nombre": "SOPORTE DESMALEZADORA",
    "descripcion": "",
    "categoria": "desbrozadoras",
    "subcategoria": "Accesorios de corte",
    "precio": 40000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=SOPORTE"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 40000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-eme000",
    "sku": "EME000",
    "nombre": "TAMBOR DE EMBRAGUE HQV61-268",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 35000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=EME000"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 35000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 34000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-eme008",
    "sku": "EME008",
    "nombre": "TAMBOR DE EMBRAGUE PLUSS STIHL MS390 FIJO 3/8 X7 DIENTES C/ROD",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 35000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=EME008"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 35000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 32000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-5400182111986",
    "sku": "5400182111986",
    "nombre": "TAMBOR DE EMBRAGUE STIHL 038",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 27000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=5400182111986"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 27000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 26000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-t104",
    "sku": "T104",
    "nombre": "TAMBOR DE EMBRAGUE STIHL MS250 325 X7",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 25000,
    "stock": 0,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=T104"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-t100",
    "sku": "T100",
    "nombre": "TAMBOR DESBROZADO",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 20000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=T100"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 20000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 18500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-eme022",
    "sku": "EME022",
    "nombre": "TAMBOR EMBRAGUE C/RODAMIENTO PLUSS HQV450 .325X7",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 35000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=EME022"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 35000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 33000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-eme-017",
    "sku": "EME 017",
    "nombre": "TAMBOR EMBRAGUE HQV 365",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 35000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=EME%20017"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 35000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-ene019",
    "sku": "ENE019",
    "nombre": "TAMBOR EMBRAGUE HQV0445",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 35000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=ENE019"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 35000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-eme017",
    "sku": "EME017",
    "nombre": "TAMBOR EMBRAGUE HS236 FIJO 0.325 X7 DIENTE C/ROD",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 30000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=EME017"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 30000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 28000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-t101",
    "sku": "T101",
    "nombre": "TAMBOR SUPERSTEEL CHINO 5200-5800",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 25000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=T101"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-t102",
    "sku": "T102",
    "nombre": "TAMBOR SUPERSTEEL CHINO HQV",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 25000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=T102"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      },
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-t103",
    "sku": "T103",
    "nombre": "TAMBOR+PIÑON MOTO C/MS250 .325 7T",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 25000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=T103"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 25000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 23500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-eme016",
    "sku": "EME016",
    "nombre": "TAMBORES EMBRAGUE PLUSS ST361 3/8X7 DIENTES CON CORONA Y RODAMIENTO",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Embragues",
    "precio": 35000,
    "stock": 5,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=EME016"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 35000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 32000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-431",
    "sku": "431",
    "nombre": "TAOA DE ARRANQUE HQV440",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 35000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=431"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 35000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 32000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-420",
    "sku": "420",
    "nombre": "TAPA ARRANQUE CORTADORA DE PASTO BRIGGS&STRATTON",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 45000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=420"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 45000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-430",
    "sku": "430",
    "nombre": "TAPA ARRANQUE HQV445-450",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 30000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=430"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 30000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-460",
    "sku": "460",
    "nombre": "TAPA DE ARRANQUE AOLLADOR CHINO VARIOS",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 25000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=460"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 25000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-490",
    "sku": "490",
    "nombre": "TAPA DE ARRANQUE DESBROZADORA AOLLADOR COMPLETA",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 30000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=490"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 30000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-470",
    "sku": "470",
    "nombre": "TAPA DE ARRANQUE DESBROZADORA CHINA 26CC",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 20000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=470"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 20000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-480",
    "sku": "480",
    "nombre": "TAPA DE ARRANQUE HQV143",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 25000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=480"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 25000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-440",
    "sku": "440",
    "nombre": "TAPA DE ARRANQUE HQV435-440",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 35000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=440"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 35000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-450",
    "sku": "450",
    "nombre": "TAPA DE ARRANQUE MTR ESTACIONARIO HONDA",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 25000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=450"
    ],
    "compatibilidades": [
      {
        "marca": "Honda",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 25000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-410",
    "sku": "410",
    "nombre": "TAPA DE ARRANQUE STIHL MS360",
    "descripcion": "",
    "categoria": "carburacion-arranque",
    "subcategoria": "Arranque",
    "precio": 30000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=410"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 30000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-890",
    "sku": "890",
    "nombre": "TAPA DE BENCINA HQV61",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 8000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=890"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-500",
    "sku": "500",
    "nombre": "TAPA DE CADENA CHINA",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Cadenas",
    "precio": 25000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=500"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 25000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-510",
    "sku": "510",
    "nombre": "TAPA DE CADENA PODADORA EN ALTURA CHINA",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Cadenas",
    "precio": 15000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=510"
    ],
    "compatibilidades": [
      {
        "marca": "Genérica/China",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 15000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-870",
    "sku": "870",
    "nombre": "TAPA DE COMBUSTIBLE MOTOSIERRA STIHL180",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 8000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=870"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-4710462425629",
    "sku": "4710462425629",
    "nombre": "TAPA DEPOSITO ACEITE HQV 61",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 3000,
    "stock": 3,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=4710462425629"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 3000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 2000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-880",
    "sku": "880",
    "nombre": "TAPA MOTOSIERRA BENCINA STIHL 250-360-390",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 8000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=880"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 8000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 7000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-tr105",
    "sku": "TR105",
    "nombre": "TENSOR CADENA HQV 61-268",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 5000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=TR105"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-tr100",
    "sku": "TR100",
    "nombre": "TENSOR CADENA HQV235-236",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 5000,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=TR100"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-805232013053",
    "sku": "805232013053",
    "nombre": "TENSOR CADENA RAISMAN STIHL 380-381",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 5000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=805232013053"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-1021",
    "sku": "1021",
    "nombre": "TRINQUETE DESBROSADORA STHIL",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 5000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=1021"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-503-381-046",
    "sku": "503 381 046",
    "nombre": "TRINQUETE RAISMAN MOTOSIERRA STIHL MS380-381-038",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 5000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=503%20381%20046"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-1023",
    "sku": "1023",
    "nombre": "TRINQUETE STIHL 380- 038",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 2000,
    "stock": 18,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=1023"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 2000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-503025063",
    "sku": "503025063",
    "nombre": "TRINQUETES RAISMAN PARA MOTOSIERRA STIHL",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 5000,
    "stock": 10,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=503025063"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 5000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 4500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-589901",
    "sku": "589901",
    "nombre": "TUERCA DE BARRA HEXAGONAL MS250",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 2000,
    "stock": 15,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=589901"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 2000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 1800
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-1010",
    "sku": "1010",
    "nombre": "TUERCA ESPADA HQV",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 2000,
    "stock": 11,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=1010"
    ],
    "compatibilidades": [
      {
        "marca": "Husqvarna",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 2000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 1500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-503360053",
    "sku": "503360053",
    "nombre": "TUERCA ESPADA STIHL",
    "descripcion": "",
    "categoria": "espadas-cadenas",
    "subcategoria": "Espadas",
    "precio": 2000,
    "stock": 20,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=503360053"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 2000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 1500
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-tapa",
    "sku": "TAPA",
    "nombre": "Tapa Podador Altura",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 20000,
    "stock": 1,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=TAPA"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 20000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-111111",
    "sku": "111111",
    "nombre": "Trinquetes Metalicos Varios Modelos",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 10000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=111111"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 10000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-900",
    "sku": "900",
    "nombre": "VALVULA DESCOMPRESION",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 15000,
    "stock": 4,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=900"
    ],
    "compatibilidades": [],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": 9,
        "precioUnitario": 15000
      },
      {
        "desde": 10,
        "hasta": null,
        "precioUnitario": 14000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  },
  {
    "id": "inv-970",
    "sku": "970",
    "nombre": "VOLANTE STIHL MS361",
    "descripcion": "",
    "categoria": "repuestos-varios",
    "subcategoria": "Otros",
    "precio": 40000,
    "stock": 2,
    "fotos": [
      "https://placehold.co/600x600/FFFFFF/9AA09B/png?text=970"
    ],
    "compatibilidades": [
      {
        "marca": "Stihl",
        "modelos": []
      }
    ],
    "preciosPorVolumen": [
      {
        "desde": 1,
        "hasta": null,
        "precioUnitario": 40000
      }
    ],
    "destacado": false,
    "activo": true,
    "bajoPedido": false
  }
];
