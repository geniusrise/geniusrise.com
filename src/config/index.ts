import textConfig from './text/config.json';
import chatConfig from './text/chat/config.json';
import entityConfig from './text/entity/config.json';
import lmConfig from './text/lm/config.json';
import nliConfig from './text/nli/config.json';
import summzConfig from './text/summz/config.json';
import transConfig from './text/trans/config.json';
import txtclassConfig from './text/txtclass/config.json';
import txtqaConfig from './text/txtqa/config.json';

const _config = textConfig

const config = {
  chat: {models: chatConfig, ..._config.chat},
  entity: entityConfig,
  lm: {models: lmConfig, ..._config.lm},
  nli: {models: nliConfig, ..._config.nli},
  summz: {models: summzConfig, ..._config.summz},
  trans: {models: transConfig, ..._config.trans},
  txtclass: {models: txtclassConfig, ..._config.txtclass},
  txtqa: {models: txtqaConfig, ..._config.txtqa},
};

export default config;