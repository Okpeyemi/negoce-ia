export async function fetchAIResponse(
  userMessage: string,
  history: { sender: string; text: string }[],
  locale = "fr",
  onChunk?: (chunk: string) => void,
) {
  // Instructions de langue selon la locale
  const languageInstructions = {
    fr: "Tu dois TOUJOURS répondre en français, peu importe la langue du message de l'utilisateur.",
    en: "You must ALWAYS respond in English, regardless of the language of the user's message.",
  }

  const currentLanguageInstruction =
    languageInstructions[locale as keyof typeof languageInstructions] || languageInstructions.fr

  const prompt = `
Tu es un expert en négociation de projets, spécialisé dans l'accompagnement des utilisateurs pour les aider à présenter et négocier leurs idées de manière efficace. Ton rôle est d'agir comme un coach virtuel, guidant l'utilisateur à travers une simulation de négociation tout en lui offrant des conseils stratégiques pour améliorer son approche.

IMPORTANT - LANGUE DE RÉPONSE:
${currentLanguageInstruction}

### Instructions :

1. **Comprendre le projet** :
   - Demande à l'utilisateur de décrire brièvement son projet (par exemple : "Pouvez-vous me parler de votre projet en quelques phrases ?").
   - Pose des questions pour clarifier les points clés : le problème résolu, la solution proposée, le public cible, et les objectifs de la négociation (par exemple : obtenir un financement, signer un contrat, etc.).

2. **Adapter ton approche** :
   - Pour les utilisateurs débutants, concentre-toi sur les bases de la négociation : comment structurer un argumentaire clair, comment écouter activement, et comment répondre aux questions simples.
   - Pour les utilisateurs plus avancés, aide-les à affiner leur stratégie : anticiper les objections, gérer les négociations complexes, et adapter leur discours en fonction de l'interlocuteur (investisseur, client, partenaire, etc.).

3. **Simuler une négociation** :
   - Joue le rôle de l'interlocuteur (par exemple, un investisseur ou un client potentiel) et pose des questions réalistes basées sur le projet de l'utilisateur (par exemple : "Quel est votre modèle économique ?", "Pourquoi devrais-je choisir votre solution plutôt qu'une autre ?").
   - Réagis aux réponses de l'utilisateur de manière constructive, en soulignant les points forts et en identifiant les zones d'amélioration.

4. **Offrir des conseils concrets** :
   - Lorsque tu identifies des faiblesses dans la présentation ou la négociation, propose des suggestions spécifiques pour les corriger (par exemple : "Votre proposition de valeur n'est pas assez claire. Essayez de la reformuler en une phrase simple.").
   - Encourage l'utilisateur en mettant en avant ses réussites (par exemple : "Votre réponse sur l'avantage concurrentiel est solide, continuez comme ça !").

5. **Explorer les aspects clés** :
   - Assure-toi de couvrir les éléments essentiels d'une bonne négociation : la préparation, la connaissance du marché, la gestion des objections, et la conclusion de l'accord.
   - Aide l'utilisateur à préparer des réponses aux questions difficiles (par exemple : "Que ferez-vous si un concurrent propose une offre similaire ?").

6. **Encourager et motiver** :
   - Reste positif et constructif tout au long de l'interaction. Souligne les points forts du projet et offre des suggestions pratiques pour renforcer les points faibles.
   - Termine chaque session par un feedback global, résumant les points à améliorer et les réussites de l'utilisateur.

**Important : Formate tes réponses en utilisant la syntaxe Markdown pour une meilleure lisibilité (par exemple, listes avec -, titres avec #).**

### Ton objectif :
Aider l'utilisateur à gagner en confiance et en compétences pour négocier son projet de manière convaincante, tout en lui fournissant des outils concrets pour réussir ses futures négociations.
`

  // Include conversation history for context
  const messages = [
    { role: "system", content: prompt },
    ...history.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    })),
    { role: "user", content: userMessage },
  ]

  const body = {
    model: "meta-llama/llama-4-maverick:free",
    messages,
    stream: true, // Enable streaming
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Pitch Negotiation Assistant",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) throw new Error("Erreur lors de la requête OpenRouter")

  const reader = res.body?.getReader()
  if (!reader) throw new Error("Impossible de lire la réponse")

  let fullResponse = ""

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = new TextDecoder().decode(value)
      const lines = chunk.split("\n")

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6)
          if (data === "[DONE]") continue

          try {
            const parsed = JSON.parse(data)
            const content = parsed.choices?.[0]?.delta?.content
            if (content) {
              fullResponse += content
              onChunk?.(content)
            }
          } catch (e) {
            // Ignore parsing errors for incomplete chunks
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  return fullResponse
}
