export {}

declare global {
    type Model = {
        id?: number
        created_at: string
        updated_at: string
    }

    type Column = Model & {
        title: string
    }

    type Board = Model & {
        structure: Column[]
    }

    type Ticket = Model & {
        title: string
        description?: string
        board_id?: Board['id']
        column_id: Column['id']
    }
}
