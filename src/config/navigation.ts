export const functions: any = {
    text: [
        {
            function_name: "TXTCLASS",
            enabled: true,
            name: "Classification",
            description:
                "Categorizing data into predefined classes. Used in spam detection, sentiment analysis etc. Can be binary or multi-class. Needs labeled data for training.",
            link: "/TXTCLASS",
        },
        {
            function_name: "LM",
            enabled: true,
            name: "Language Modeling",
            description: "Predicting next word in a sequence. Used in text generation, auto-completion etc. Models relationships between words.",
            link: "/LM",
        },
        {
            function_name: "TXTQA",
            enabled: true,
            name: "Question Answering",
            description:
                "Extracts answers from text given a question. Used in search engines, customer service etc. Requires understanding of question context.",
            link: "/TXTQA",
        },
        {
            function_name: "ENTITY",
            enabled: true,
            name: "Named Entity Recogniton",
            description:
                "Categorizing tokens into predefined classes of entities. Used for identifying specific terms like places, time, or types of terms like diseases and symptoms.",
            link: "/ENTITY",
        },
        {
            function_name: "CHAT",
            enabled: true,
            name: "Conversational Agent",
            description:
                "Automated text-based conversational agent. Answers queries, provide recommendations. Utilizes NLP for understanding and responding.",
            link: "/CHAT",
        },
        {
            function_name: "NLI",
            enabled: true,
            name: "Natural Language Inference",
            description:
                "Inferring general knowledge from text. Used to understand implications, assumptions. Enhances NLP applications with real-world understanding.",
            link: "/NLI",
        },
        {
            function_name: "EMBED",
            enabled: false,
            name: "Sentence Embeddings",
            description: "Transforms sentences to vector space. Used in text similarity, clustering etc. Captures semantic meaning of sentences.",
            link: "/EMBED",
        },
        {
            function_name: "EMOTION",
            enabled: true,
            name: "Sentiment Analysis",
            description:
                "Determines sentiment of text. Used in customer feedback, social media monitoring. Categorizes text as positive, negative, or neutral.",
            link: "/EMOTION",
        },
        {
            function_name: "SUMMZ",
            enabled: true,
            name: "Summarization",
            description:
                "Reduces text to essential information. Used in news summarization, document management. Generates concise summary retaining key points.",
            link: "/SUMMZ",
        },
        {
            function_name: "TRANS",
            enabled: true,
            name: "Translation",
            description:
                "Converts text from one language to another. Used in real-time translation services, content localization. Relies on bilingual datasets.",
            link: "/TRANS",
        },
    ],
    vision: [
        {
            function_name: "OCR",
            enabled: true,
            name: "Optical Character Recognition",
            description:
                "Extracting text from images. Useful in digitizing documents, license plate recognition, etc. Converts image text to digital text.",
            link: "/OCR",
        },
        {
            function_name: "IMAGE",
            enabled: false,
            name: "Image Generation",
            description: "Creating new images with AI. Useful in art, design, etc. Can generate images from scratch or based on certain conditions.",
            link: "/IMAGE",
        },
        {
            function_name: "SCALE",
            enabled: false,
            name: "Super Resolution",
            description:
                "Enhancing the resolution of images. Useful in surveillance, medical imaging, etc. Converts low-res images to high-res equivalents.",
            link: "/SCALE",
        },
        {
            function_name: "PAINT",
            enabled: false,
            name: "Inpainting",
            description:
                "Filling in missing or corrupted parts of images. Useful in restoration, editing, etc. Provides a complete image from a partial input.",
            link: "/PAINT",
        },
        {
            function_name: "STYLE",
            enabled: false,
            name: "Style Transfer",
            description:
                "Applying artistic styles to images. Useful in design, art, etc. Transfers the style of one image to the content of another.",
            link: "/STYLE",
        },
        {
            function_name: "IMGCLASS",
            enabled: true,
            name: "Image Classification",
            description:
                "Categorizing images into predefined classes. Useful in object recognition, filtering, etc. Requires labeled data for training.",
            link: "/IMGCLASS",
        },
        {
            function_name: "OBJECT",
            enabled: false,
            name: "Object Detection",
            description:
                "Identifying and locating objects in images. Used in surveillance, retail, etc. Provides bounding boxes around detected objects.",
            link: "/OBJECT",
        },
        {
            function_name: "SEGMENT",
            enabled: true,
            name: "Image Segmentation",
            description:
                "Dividing images into multiple segments. Useful in medical imaging, autonomous vehicles, etc. Provides pixel-wise categorization.",
            link: "/SEGMENT",
        },
        {
            function_name: "FACE",
            enabled: false,
            name: "Face Recognition",
            description:
                "Identifying or verifying individuals using facial features. Used in security, social media, etc. Compares input with a database.",
            link: "/FACE",
        },
        {
            function_name: "POSE",
            enabled: false,
            name: "Pose Estimation",
            description: "Determining the position of body parts. Useful in fitness, gaming, etc. Provides coordinates of body joints.",
            link: "/POSE",
        },
    ],
    audio: [
        {
            function_name: "SPEECH",
            enabled: true,
            name: "Speech Transcription",
            description: "Converting spoken language into text. Used in voice assistants, transcription services, etc. Requires audio input.",
            link: "/SPEECH",
        },
        {
            function_name: "SPEAK",
            enabled: true,
            name: "Text to Speech",
            description: "Converting text to spoken language. Useful in accessibility, voice response systems, etc. Provides audio output.",
            link: "/SPEAK",
        },
        {
            function_name: "SOUNDCLASS",
            enabled: false,
            name: "Sound Classification",
            description: "Categorizing sounds into predefined classes. Used in surveillance, healthcare, etc. Requires labeled audio data.",
            link: "/SOUNDCLASS",
        },
        {
            function_name: "MUSIC",
            enabled: false,
            name: "Music Generation",
            description: "Creating music through algorithms. Useful in composing, entertainment, etc. Can be guided by specific styles or inputs.",
            link: "/MUSIC",
        },
        {
            function_name: "AUDIOFX",
            enabled: false,
            name: "Audio Effects",
            description: "Applying effects to audio signals. Useful in music production, broadcasting, etc. Includes reverb, pitch shift, etc.",
            link: "/AUDIOFX",
        },
    ],
}
