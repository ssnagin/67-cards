import type { AuthResponse, LoginData, UserResponse, RegisterData, StatusResponse } from "~/types/user/auth/userAuth"
import type { Deck, DeckPage, CreateDeckPayload } from "~/types/content/deck"
import type { Card } from "~/types/content/card"

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface EndpointConfig<Req = undefined, Res = undefined> {
  path: string
  method: HttpMethod

  // Эти поля нужны исключительно для TypeScript, физически в JS они будут undefined
  _req?: Req
  _res?: Res
}

export const apiEndpoints = {
    users: {
        me: {
            path: '/api/users/me',
            method: 'GET'
        } as EndpointConfig<undefined, UserResponse>
    },
    decks: {
        list: {
            path: '/api/decks',
            method: 'GET'
        } as EndpointConfig<undefined, DeckPage>,
        create: {
            path: '/api/decks',
            method: 'POST'
        } as EndpointConfig<CreateDeckPayload, Deck>
    },
    auth: {
        // В дженерики <Req, Res> передаем созданные выше интерфейсы
        login: {
            path: '/api/auth/login',
            method: 'POST',
        } as EndpointConfig<LoginData, AuthResponse>,

        register: {
            path: '/api/auth/register',
            method: 'POST'
        } as EndpointConfig<RegisterData, StatusResponse>
    },
    cards: (deckId: string) => ({
        list: {
            path: `/api/decks/${deckId}/cards`,
            method: 'GET'
        } as EndpointConfig<undefined,Card[]>,
        create:{
            path: `/api/decks/${deckId}/cards`,
            method: 'POST'
        } as EndpointConfig<Card,Card>,
        get: (cardId:string) =>({
            path: `/api/decks/${deckId}/cards/${cardId}`,
            method: 'GET'
        }as EndpointConfig<undefined,Card>
        ) ,
        update: (cardId:string) =>({
            path: `/api/decks/${deckId}/cards/${cardId}`,
            method: 'PUT'
        }as EndpointConfig<Card,Card>) ,
        delete: (cardId:string)=>({
            path: `/api/decks/${deckId}/cards/${cardId}`,
            method: 'DELETE'
        }as EndpointConfig<undefined,void>) 
    }),

    

} as const
