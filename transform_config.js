// Descriptions for each field
var fieldDescriptions = {
    awq_enabled:
        "Indicates if Adaptive Weight Quantization (AWQ) is enabled. AWQ helps in reducing model size and speeding up inference while maintaining similar performance. Enabling this could benefit deployments with limited resources.",
    flash_attention:
        "Indicates if Flash Attention optimization is enabled. This optimization is often used to speed up computations, especially for large models, by making attention computations more efficient.",
    notification_email:
        "Email address to send notifications about model serving status. Setting this allows for monitoring and alerting on model performance or downtime.",
    model_class:
        "Specifies the class of the model to be loaded from the Huggingface library for causal language modeling. Changing this affects the type of model used and its capabilities.",
    tokenizer_class:
        "Specifies the class of the tokenizer to be used with the model for processing input text. The tokenizer class should match the model's requirements and language.",
    use_cuda:
        "Indicates whether CUDA (GPU acceleration) should be used for model deployment. Enabling CUDA can significantly speed up computation at the cost of higher GPU resource utilization.",
    precision:
        "Determines the precision level for calculations (e.g., float16, float32). Lower precision like float16 can speed up performance but might affect the model's accuracy or result quality.",
    quantization:
        "Quantization configuration for the model to optimize performance. It reduces model size and increases inference speed without significant loss of quality. Different levels of quantization may affect the performance and size trade-off.",
    device_map:
        "Mapping of model layers to specific devices, typically GPUs, for distributed computation. Setting this can optimize the model's performance on available hardware.",
    max_memory:
        "Maximum memory that can be used by the model in megabytes. Useful for varraining resource usage in environments with limited memory.",
    torchscript:
        "Indicates if the model should be converted to TorchScript. TorchScript conversion allows for better performance and easier deployment across different platforms.",
    decoding_strategy:
        "Specifies the strategy used in the model's decoding phase. This involves how the model generates predictions and affects the output's quality and diversity.",
    generation_max_new_tokens: "The maximum number of new tokens that can be generated in the model's output.",
    generation_do_sample: "Indicates whether the generation should use sampling; otherwise, it might use a deterministic approach.",
    generation_repetition_penalty: "The penalty applied to prevent the model from repeating the same token in generation.",
    generation_bos_token_id: "The token id used to indicate the beginning of a sequence in generation.",
    generation_eos_token_id: "The token id used to indicate the end of a sequence in generation.",
    generation_pad_token_id: "The token id used for padding incomplete sequences in generation.",
    generation_temperature: "Controls the randomness of predictions by scaling the logits before applying softmax during generation.",
    generation_top_k: "Limits the number of highest probability vocabulary tokens to keep for top-k-filtering.",
    generation_top_p: "Keeps the top tokens with cumulative probability >= top_p to maintain the diversity of the generation.",
    endpoint: "Endpoint URL for API deployment. Typically you would want to leave it at 0.0.0.0",
    port: "Port number for API deployment, typically leave it at default.",
    cors_domain: "Domain allowed for Cross-Origin Resource Sharing. To handle CORS if this API is exptected to be called by a frontend application.",
    username: "Username for API authentication. Best practice to set it to a non-default value.",
    password: "Password for authentication. Best practice to set it to a non-default value.",
    generation_decoder_start_token_id: "ID for the start token used by the decoder, signifying the beginning of the generation process.",
    generation_early_stopping: "Indicates whether early stopping is used during generation to prevent overly lengthy or divergent outputs.",
    generation_forced_eos_token_id: "ID for a forced end-of-sequence token, ensuring generation concludes appropriately even in complex cases.",
    generation_max_length: "Maximum length of the generated sequence, controlling the verbosity and detail of outputs.",
    generation_num_beams: "Number of beams used in beam search strategy, balancing between quality of output and computational expense.",
    generation_forced_bos_token_id: "Forced beginning-of-sequence token ID, ensuring generation starts with a specific token.",
    generation_length_penalty: "Penalty applied to longer sequences in beam search, influencing the length of generated content.",
    generation_min_length: "Minimum length of generated sequences, ensuring a base level of content in outputs.",
    generation_no_repeat_ngram_size: "Size of n-grams that must not be repeated in the text, preventing redundancy in generation.",
    generation_num_hidden_layers:
        "Specifies the number of hidden layers in the transformer model. Adjusting this can affect model size and performance.",
    generation_output_past: "Indicates whether to output past states, useful in iterative generation scenarios for efficiency.",
    generation_prefix: "A string to be added at the beginning of each generated text, often used to control the style or add context to generation.",
    generation_model_type:
        "Indicates the model architecture type used for generation, like 'bert', 'gpt-2'. It influences how text is generated based on model's capabilities.",
}

// Data types for each field
var fieldTypes = {
    awq_enabled: "boolean",
    flash_attention: "boolean",
    notification_email: "string or null",
    model_class: "string",
    tokenizer_class: "string",
    use_cuda: "boolean",
    precision: "string",
    quantization: "integer",
    device_map: "string",
    max_memory: "integer or null",
    torchscript: "boolean",
    decoding_strategy: "string",
    generation_max_new_tokens: "integer",
    generation_do_sample: "boolean",
    generation_repetition_penalty: "float or integer",
    generation_bos_token_id: "integer",
    generation_eos_token_id: "integer",
    generation_pad_token_id: "integer",
    generation_temperature: "float",
    generation_top_k: "integer",
    generation_top_p: "float",
    generation_decoding_strategy: "string",
    generation_decoder_start_token_id: "integer",
    generation_early_stopping: "boolean",
    generation_forced_eos_token_id: "integer",
    generation_max_length: "integer",
    generation_num_beams: "integer",
    generation_forced_bos_token_id: "integer",
    generation_length_penalty: "float",
    generation_min_length: "integer",
    generation_no_repeat_ngram_size: "integer",
    generation_num_hidden_layers: "integer",
    generation_output_past: "boolean",
    generation_prefix: "string",
}

// Possible values for each field if applicable
var possibleValues = {
    precision: ["float32", "float16", "bfloat16"],
    device_map: ["auto", "cuda:0", "cpu"],
    decoding_strategy: [
        "generate",
        "greedy_search",
        "contrastive_search",
        "sample",
        "beam_search",
        "beam_sample",
        "group_beam_search",
        "varrained_beam_search",
    ],
    quantization: [2, 4, 8],
    generation_model_type: [
        "bert",
        "gpt-2",
        "transformer-xl",
        "xlnet",
        "t5",
        "led",
        "mistral",
        "llama",
        "llama2",
        "roberta",
        "deberta",
        "distilbert",
    ],
}

// Transform a single config entry
function transformConfig(config) {
    return Object.entries(config).map(([key, value]) => ({
        name: key,
        description: fieldDescriptions[key] || "No description available.",
        type: fieldTypes[key] || "No type available.",
        default: value, // stringify to handle all types correctly
        possible: possibleValues[key] ? possibleValues[key] : null,
    }))
}

var apiConfigs = config.SUMMZ.models.map(x => ({ ...x.apiDeploy }))
var bulkConfigs = config.SUMMZ.models.map(x => ({ ...x.bulkDeploy }))

var transformedAPIConfigs = apiConfigs.map(transformConfig)
var transformedBulkConfigs = bulkConfigs.map(transformConfig)

// Merge transformed configurations back into the original config.CHAT.models
for (let i = 0; i < config.SUMMZ.models.length; i++) {
    config.SUMMZ.models[i].apiDeploy = { ...transformedAPIConfigs[i] }
    config.SUMMZ.models[i].bulkDeploy = { ...transformedBulkConfigs[i] }
}

// Output the transformed TRANS
console.log(JSON.stringify(config.SUMMZ.models, null, 2))

var apiConfigs = config.NLI.models.map(x => ({ ...x.apiDeploy }))
var bulkConfigs = config.NLI.models.map(x => ({ ...x.bulkDeploy }))

var transformedAPIConfigs = apiConfigs.map(transformConfig)
var transformedBulkConfigs = bulkConfigs.map(transformConfig)

// Merge transformed configurations back into the original config.CHAT.models
for (let i = 0; i < config.NLI.models.length; i++) {
    config.NLI.models[i].apiDeploy = { ...transformedAPIConfigs[i] }
    config.NLI.models[i].bulkDeploy = { ...transformedBulkConfigs[i] }
}

// Output the transformed TRANS
console.log(JSON.stringify(config.NLI.models, null, 2))

var apiConfigs = config.TXTQA.models.map(x => ({ ...x.apiDeploy }))
var bulkConfigs = config.TXTQA.models.map(x => ({ ...x.bulkDeploy }))

var transformedAPIConfigs = apiConfigs.map(transformConfig)
var transformedBulkConfigs = bulkConfigs.map(transformConfig)

// Merge transformed configurations back into the original config.CHAT.models
for (let i = 0; i < config.TXTQA.models.length; i++) {
    config.TXTQA.models[i].apiDeploy = { ...transformedAPIConfigs[i] }
    config.TXTQA.models[i].bulkDeploy = { ...transformedBulkConfigs[i] }
}

// Output the transformed TRANS
console.log(JSON.stringify(config.TXTQA.models, null, 2))

var apiConfigs = config.TRANS.models.map(x => ({ ...x.apiDeploy }))
var bulkConfigs = config.TRANS.models.map(x => ({ ...x.bulkDeploy }))

var transformedAPIConfigs = apiConfigs.map(transformConfig)
var transformedBulkConfigs = bulkConfigs.map(transformConfig)

// Merge transformed configurations back into the original config.CHAT.models
for (let i = 0; i < config.TRANS.models.length; i++) {
    config.TRANS.models[i].apiDeploy = { ...transformedAPIConfigs[i] }
    config.TRANS.models[i].bulkDeploy = { ...transformedBulkConfigs[i] }
}

// Output the transformed TRANS
console.log(JSON.stringify(config.TRANS.models, null, 2))

var apiConfigs = config.ENTITY.models.map(x => ({ ...x.apiDeploy }))
var bulkConfigs = config.ENTITY.models.map(x => ({ ...x.bulkDeploy }))

var transformedAPIConfigs = apiConfigs.map(transformConfig)
var transformedBulkConfigs = bulkConfigs.map(transformConfig)

// Merge transformed configurations back into the original config.CHAT.models
for (let i = 0; i < config.ENTITY.models.length; i++) {
    config.ENTITY.models[i].apiDeploy = { ...transformedAPIConfigs[i] }
    config.ENTITY.models[i].bulkDeploy = { ...transformedBulkConfigs[i] }
}

// Output the transformed ENTITY
console.log(JSON.stringify(config.ENTITY.models, null, 2))

var apiConfigs = config.TXTCLASS.models.map(x => ({ ...x.apiDeploy }))
var bulkConfigs = config.TXTCLASS.models.map(x => ({ ...x.bulkDeploy }))

var transformedAPIConfigs = apiConfigs.map(transformConfig)
var transformedBulkConfigs = bulkConfigs.map(transformConfig)

// Merge transformed configurations back into the original config.CHAT.models
for (let i = 0; i < config.TXTCLASS.models.length; i++) {
    config.TXTCLASS.models[i].apiDeploy = { ...transformedAPIConfigs[i] }
    config.TXTCLASS.models[i].bulkDeploy = { ...transformedBulkConfigs[i] }
}

// Output the transformed TXTCLASS
console.log(JSON.stringify(config.TXTCLASS.models, null, 2))

var apiConfigs = config.EMOTION.models.map(x => ({ ...x.apiDeploy }))
var bulkConfigs = config.EMOTION.models.map(x => ({ ...x.bulkDeploy }))

var transformedAPIConfigs = apiConfigs.map(transformConfig)
var transformedBulkConfigs = bulkConfigs.map(transformConfig)

// Merge transformed configurations back into the original config.CHAT.models
for (let i = 0; i < config.EMOTION.models.length; i++) {
    config.EMOTION.models[i].apiDeploy = { ...transformedAPIConfigs[i] }
    config.EMOTION.models[i].bulkDeploy = { ...transformedBulkConfigs[i] }
}

// Output the transformed EMOTION
console.log(JSON.stringify(config.EMOTION.models, null, 2))

var apiConfigs = config.LM.models.map(x => ({ ...x.apiDeploy }))
var bulkConfigs = config.LM.models.map(x => ({ ...x.bulkDeploy }))

var transformedAPIConfigs = apiConfigs.map(transformConfig)
var transformedBulkConfigs = bulkConfigs.map(transformConfig)

// Merge transformed configurations back into the original config.CHAT.models
for (let i = 0; i < config.LM.models.length; i++) {
    config.LM.models[i].apiDeploy = { ...transformedAPIConfigs[i] }
    config.LM.models[i].bulkDeploy = { ...transformedBulkConfigs[i] }
}

// Output the transformed configurations
console.log(JSON.stringify(config.LM.models, null, 2))

var apiConfigs = config.CHAT.models.map(x => ({ ...x.apiDeploy }))
var bulkConfigs = config.CHAT.models.map(x => ({ ...x.bulkDeploy }))

var transformedAPIConfigs = apiConfigs.map(transformConfig)
var transformedBulkConfigs = bulkConfigs.map(transformConfig)

// Merge transformed configurations back into the original config.CHAT.models
for (let i = 0; i < config.CHAT.models.length; i++) {
    config.CHAT.models[i].apiDeploy = { ...transformedAPIConfigs[i] }
    config.CHAT.models[i].bulkDeploy = { ...transformedBulkConfigs[i] }
}

// Output the transformed configurations
console.log(JSON.stringify(config.CHAT.models, null, 2))
