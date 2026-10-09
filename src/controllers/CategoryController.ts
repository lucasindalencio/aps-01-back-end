import type { Request, Response } from "express";
import Category from "../models/Category.js";
import CategoryRepository from "../repositories/CategoryRepository.js";

// Valida os dados recebidos. Retorna a mensagem de erro ou null se estiver tudo certo.
function validate(body: any): string | null {
    if (!body || !body.name || typeof body.name !== "string") {
        return "O campo 'name' é obrigatório.";
    }

    if (body.display_order !== undefined &&
        (!Number.isInteger(body.display_order) || body.display_order < 0)) {
        return "O campo 'display_order' deve ser um número inteiro maior ou igual a 0.";
    }

    if (body.active !== undefined && typeof body.active !== "boolean") {
        return "O campo 'active' deve ser true ou false.";
    }

    return null;
}

function buildCategory(body: any) {
    return new Category(
        body.name,
        body.description ?? null,
        body.icon ?? null,
        body.display_order ?? 0,
        body.active ?? true
    );
}

async function getAll(req: Request, res: Response) {
    try {
        const categories = await CategoryRepository.findAll();

        res.status(200).json(categories);
    } catch (error) {
        console.error("Erro ao buscar categorias: ", error);

        res.status(500).json({
            message: "Erro ao buscar categorias.",
        });
    }
}

async function getByKeyword(req: Request<{ keyword: string }>, res: Response) {
    const { keyword } = req.params;

    if (!keyword || typeof keyword != "string") {
        return res.status(400).json({
            message: "Palavra-chave não informada."
        });
    }

    try {
        const categories = await CategoryRepository.searchByKeyword(keyword);

        res.status(200).json(categories);
    } catch (error) {
        console.error("Erro ao pesquisar por categoria: ", error);

        res.status(500).json({
            message: "Erro ao pesquisar categoria.",
        });
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID da Categoria não informado."
        });
    }

    try {
        const category = await CategoryRepository.findById(id);

        res.status(200).json(category);
    } catch (error) {
        console.error("Erro ao buscar categoria: ", error);

        res.status(404).json({
            message: "Categoria não encontrada.",
        });
    }
}

async function create(req: Request, res: Response) {
    const message = validate(req.body);

    if (message) {
        return res.status(400).json({ message });
    }

    try {
        const category = await CategoryRepository.create(buildCategory(req.body));

        res.status(201).json(category);
    } catch (error) {
        console.error("Erro ao criar categoria: ", error);

        res.status(500).json({
            message: "Erro ao criar categoria.",
        });
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID da Categoria não informado."
        });
    }

    const message = validate(req.body);

    if (message) {
        return res.status(400).json({ message });
    }

    try {
        const category = await CategoryRepository.update(id, buildCategory(req.body));

        res.status(200).json(category);
    } catch (error: any) {
        console.error("Erro ao atualizar categoria: ", error);

        // PGRST116: nenhum registro encontrado
        if (error?.code === "PGRST116") {
            return res.status(404).json({
                message: "Categoria não encontrada.",
            });
        }

        res.status(500).json({
            message: "Erro ao atualizar categoria.",
        });
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID da Categoria não informado."
        });
    }

    try {
        await CategoryRepository.remove(id);

        res.status(200).json({
            message: "Categoria removida com sucesso.",
        });
    } catch (error: any) {
        console.error("Erro ao remover categoria: ", error);

        // PGRST116: nenhum registro encontrado
        if (error?.code === "PGRST116") {
            return res.status(404).json({
                message: "Categoria não encontrada.",
            });
        }

        // 23503: categoria ainda possui produtos (chave estrangeira)
        if (error?.code === "23503") {
            return res.status(409).json({
                message: "Não é possível remover a categoria pois existem produtos associados a ela.",
            });
        }

        res.status(500).json({
            message: "Erro ao remover categoria.",
        });
    }
}

export default {
    getAll,
    getById,
    getByKeyword,
    create,
    update,
    remove
}
