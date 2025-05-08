import { OpenAI } from 'openai';
import { useDb } from '~/db';
import { prompts } from '~/db/schema/prompts';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { prompt } = body;

  if (!prompt) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Prompt is required',
    });
  }

  const db = useDb(event.context.cloudflare.env);

  const runtimeConfig = useRuntimeConfig();
  const llmEndpoint = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: runtimeConfig.public.deepseekApiKey as string,
  });
  try {
    const completion = await llmEndpoint.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
        { role: 'assistant', content: engineerPrompt }
      ],
      model: 'deepseek-chat',
    });
    const codeResponse = completion.choices[0].message.content;
    const cleanedResponse = codeResponse?.replace(/<componentResponse>/g, '').replace(/<\/componentResponse>/g, '').trim();

    if (!cleanedResponse) {
      throw createError({
        statusCode: 500,
        statusMessage: 'No response from LLM',
      });
    }
    const id = crypto.randomUUID();
    const recordId = await db.insert(prompts).values({
      id,
      userId: event.context.user!.id,
      prompt: prompt,
      response: cleanedResponse,
    });

    if (!recordId) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to save prompt response',
      });
    }

    return {
      id,
      response: cleanedResponse
    };
  } catch (error) {
    console.error('Error generating calendar prompt:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    });
  }
}
);



const systemPrompt = `As a senior UI/UX engineer (\`engineer\`), you are going to guide the user through creating a monthly calendar of operating hours.
The user will provide a prompt, and you will respond with the react/tailwind code that satisfies the prompt. The codeBase is in TypeScript and uses React with Tailwind CSS.
The response should be a complete React component that conforms to the following porperties.

<componentResponse>
type DateString = string;
type CalendarProps = {
  operatingHours: Record<DateString, { start: DateString; end: DateString } | null>;
} 

function App({operatingHours}: CalendarProps) {
  return (
    <div className="grid grid-cols-7 gap-4">
      {Object.entries(operatingHours).map(([date, hours]) => (
        <div key={date} className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold">{date}</h3>
          {hours ? (
            <p className="text-sm text-gray-600">
              {\`Open from \${new Date(hours.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to \${new Date(hours.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\`}
            </p>
          ) : (
            <p className="text-sm text-gray-600">Closed</p>
          )}
        </div>
      ))}
    </div>
  )
}
</componentResponse>

It is *critical* that you respond with the code in the format above, and nothing else. Do not include any explanations or additional text outside of the <componentResponse> tags. Do not start the response with "Generated calendar prompt: <componentResponse>" or any other text. The code should be a complete React component that can be used directly in a React application.
Additionally, ensure that the code is formatted correctly and adheres to best practices for React and Tailwind CSS.
Any questions not pertaining to the aesthetic or functionality of the calendar should be ignored.
Any questions about the calendar should be answered with the code that satisfies the question/suggestion.
`

const engineerPrompt = `<componentResponse>
type DateString = string;
type TimeSlot = {
  start: DateString;
  end: DateString;
}
type CalendarProps = {
  operatingHours: Record<DateString, {
    periods: TimeSlot[];
  } | null>;
}

function App({operatingHours}: CalendarProps) {
  return (
`
