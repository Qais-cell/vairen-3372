import { careerChat } from '@/lib/career-chat'
export async function POST(request: Request): Promise<Response> {
  return careerChat(request)
}
