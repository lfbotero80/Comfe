export const SITE_TYPES = {
  hotel: {
    label: 'Hotel',
    unitTypes: ['habitacion', 'cabana', 'suite', 'cama']
  },
  parque: {
    label: 'Parque / pasadia / camping',
    unitTypes: ['cupo', 'sitio', 'carpa', 'visitante', 'pasadia']
  }
};

export const FILE_CONTRACTS = {
  occupancyInventory: {
    id: 'occupancyInventory',
    label: 'Ocupacion e inventario diario',
    acceptedExtensions: ['.csv', '.json', '.pdf'],
    templatePath: 'templates/ocupacion-inventario-diario.csv',
    requiredColumns: [
      'sede',
      'tipo_sede',
      'tipo_unidad',
      'fecha',
      'inventario_total',
      'unidades_ocupadas',
      'unidades_libres',
      'ocupacion_porcentaje',
      'fuente',
      'fecha_corte'
    ],
    optionalColumns: [
      'unidades_bloqueadas',
      'periodo',
      'temporada',
      'es_festivo',
      'dia_tipo',
      'anio_anterior_ocupacion_porcentaje',
      'observaciones'
    ],
    numericColumns: [
      'inventario_total',
      'unidades_ocupadas',
      'unidades_libres',
      'unidades_bloqueadas',
      'ocupacion_porcentaje',
      'anio_anterior_ocupacion_porcentaje'
    ],
    dateColumns: ['fecha', 'fecha_corte'],
    percentageColumns: ['ocupacion_porcentaje', 'anio_anterior_ocupacion_porcentaje'],
    enumColumns: {
      tipo_sede: ['hotel', 'parque'],
      dia_tipo: ['entre_semana', 'fin_de_semana', 'festivo', 'temporada_alta', 'cierre_operativo'],
      es_festivo: ['si', 'no']
    },
    grain: 'Una fila por sede, tipo de unidad y fecha.',
    source: 'OCUPACION HOTELES 2026.xlsx, Zeus Forecast PDF, Power BI Hoteles o archivo operativo validado.',
    businessUse: 'Fuente operativa para calcular inventario total, ocupado, libre y porcentaje de ocupacion por sede.',
    sampleRow: {
      sede: 'Nombre de sede',
      tipo_sede: 'hotel',
      tipo_unidad: 'habitacion',
      fecha: 'AAAA-MM-DD',
      inventario_total: '0',
      unidades_ocupadas: '0',
      unidades_libres: '0',
      ocupacion_porcentaje: '0',
      fuente: 'Fuente del archivo',
      fecha_corte: 'AAAA-MM-DD'
    }
  },
  budgetExecution: {
    id: 'budgetExecution',
    label: 'Presupuesto y ejecucion',
    acceptedExtensions: ['.csv', '.json'],
    templatePath: 'templates/presupuesto-ejecucion.csv',
    requiredColumns: [
      'sede',
      'periodo',
      'presupuesto',
      'ejecutado',
      'fuente',
      'fecha_corte'
    ],
    optionalColumns: [
      'presupuesto_empresarial',
      'presupuesto_individual',
      'ejecutado_empresarial',
      'ejecutado_individual',
      'cumplimiento_porcentaje',
      'dato_confiable',
      'observaciones'
    ],
    numericColumns: [
      'presupuesto',
      'ejecutado',
      'presupuesto_empresarial',
      'presupuesto_individual',
      'ejecutado_empresarial',
      'ejecutado_individual',
      'cumplimiento_porcentaje'
    ],
    dateColumns: ['fecha_corte'],
    percentageColumns: ['cumplimiento_porcentaje'],
    enumColumns: {
      dato_confiable: ['si', 'no', 'pendiente']
    },
    grain: 'Una fila por sede y periodo mensual o acumulado.',
    source: 'Distribucion del Presupuesto Unidad de Turismo 2026 o corte financiero validado.',
    businessUse: 'Controla presupuesto, ejecutado y cumplimiento por sede para reporte de gestion.',
    sampleRow: {
      sede: 'Nombre de sede',
      periodo: 'AAAA-MM',
      presupuesto: '0',
      ejecutado: '0',
      fuente: 'Fuente financiera',
      fecha_corte: 'AAAA-MM-DD'
    }
  },
  revenueRules: {
    id: 'revenueRules',
    label: 'Reglas de Revenue y tarifas',
    acceptedExtensions: ['.csv', '.json'],
    templatePath: 'templates/reglas-revenue.csv',
    requiredColumns: [
      'sede',
      'tipo_sede',
      'tipo_unidad',
      'plan_venta',
      'tramo',
      'umbral_min',
      'umbral_max',
      'accion_recomendada',
      'fuente',
      'fecha_corte'
    ],
    optionalColumns: [
      'tarifa_cat_a',
      'tarifa_cat_b',
      'tarifa_cat_c',
      'tarifa_cat_d',
      'temporada',
      'fecha_inicio',
      'fecha_fin',
      'observaciones'
    ],
    numericColumns: [
      'umbral_min',
      'umbral_max',
      'tarifa_cat_a',
      'tarifa_cat_b',
      'tarifa_cat_c',
      'tarifa_cat_d'
    ],
    dateColumns: ['fecha_corte', 'fecha_inicio', 'fecha_fin'],
    percentageColumns: ['umbral_min', 'umbral_max'],
    enumColumns: {
      tipo_sede: ['hotel', 'parque'],
      tramo: ['estandar', 'preventa', 'mas_cerca', 'cierre_operativo', 'sin_dato']
    },
    grain: 'Una fila por sede, tipo de unidad, plan de venta y tramo.',
    source: 'Archivo de reglas Revenue validado por Comercial/Reservas.',
    businessUse: 'Traduce la ocupacion en accion: mantener tarifa, preventa, Mas Cerca, campana o proteger precio.',
    sampleRow: {
      sede: 'Nombre de sede',
      tipo_sede: 'hotel',
      tipo_unidad: 'habitacion',
      plan_venta: 'Plan de venta',
      tramo: 'preventa',
      umbral_min: '40',
      umbral_max: '69',
      accion_recomendada: 'Accion comercial recomendada',
      fuente: 'Reglas vigentes',
      fecha_corte: 'AAAA-MM-DD'
    }
  }
};

export function getContract(contractId){
  return FILE_CONTRACTS[contractId];
}

export function listContracts(){
  return Object.values(FILE_CONTRACTS);
}
