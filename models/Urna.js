var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UrnaSchema = new Schema({
  dt_geracao: String,
  hh_geracao: String,
  ano_eleicao: String,
  cd_pleito: String,
  dt_pleito: String,
  nr_turno: String,
  cd_eleicao: String,
  ds_eleicao: String,
  dt_eleicao: String,
  sg_uf: String,
  cd_municipio: String,
  nm_municipio: String,
  nr_zona: String,
  nr_secao: String,
  nr_local_votacao: String,
  cd_cargo_pergunta: String,
  ds_cargo_pergunta: String,
  nr_partido: String,
  sg_partido: String,
  nm_partido: String,
  qt_aptos: Number,
  qt_comparecimento: Number,
  qt_abstencoes: Number,
  cd_tipo_urna: String,
  ds_tipo_urna: String,
  cd_tipo_votavel: String,
  ds_tipo_votavel: String,
  nr_votavel: String,
  nm_votavel: String,
  qt_votos: Number,
  nr_urna_efetivada: String,
  cd_carga_1_urna_efetivada: String,
  cd_carga_2_urna_efetivada: String,
  cd_flascard_urna_efetivada: String,
  dt_carga_urna_efetivada: String,
  ds_cargo_pergunta_secao: String,
  ds_agregadas: String,
  dt_abertura: String,
  dt_encerramento: String,
  qt_eleitores_biometria_nh: Number,
  nr_junta_apuradora: String,
  nr_turma_apuradora: String
});

//UrnaSchema.index( { name: 'text', user: 'text' } );
//UrnaSchema.index( { id: 1 } );
//UrnaSchema.index( { relevance: 1, name: 1, user: 1 } );

module.exports = mongoose.model('Urna', UrnaSchema);
