import type { Request, Response } from "express";
import Product from "../models/Product.js";
import ProductRepository from "../repositories/ProductRepository.js";

// Valida os dados recebidos. Retorna a mensagem de erro ou null se estiver tudo certo.
function validate(body: any): string | null {
    if (!body || !body.category_id || typeof body.category_id !== "string") {
        return "O campo 'category_id' é obrigatório.";
    }

    if (!body.title || typeof body.title !== "string") {
        return "O campo 'title' é obrigatório.";
    }

    if (typeof body.price !== "number" || body.price < 0) {
        return "O campo 'price' é obrigatório e deve ser um número maior ou igual a 0.";
    }

    if (body.image !== undefined && body.image !== null && typeof body.image !== "string") {
        return "O campo 'image' deve ser um texto.";
    }

    if (body.available !== undefined && typeof body.available !== "boolean") {
        return "O campo 'available' deve ser true ou false.";
    }

    if (body.active !== undefined && typeof body.active !== "boolean") {
        return "O campo 'active' deve ser true ou false.";
    }

    return null;
}

function buildProduct(body: any) {
    return new Product(
        body.category_id,
        body.title,
        body.description ?? null,
        body.price,
        body.image ?? null,
        body.available ?? true,
        body.active ?? true
    );
}

async function getAll(req: Request, res: Response) {
    try {
        const products = await ProductRepository.findAll();

        res.status(200).json(products);
    } catch (error) {
        console.error("Erro ao buscar produtos: ", error);

        res.status(500).json({
            message: "Erro ao buscar produtos.",
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
        const products = await ProductRepository.searchByKeyword(keyword);

        res.status(200).json(products);
    } catch (error) {
        console.error("Erro ao pesquisar por produto: ", error);

        res.status(500).json({
            message: "Erro ao pesquisar produto.",
        });
    }
}

async function getById(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID do Produto não informado."
        });
    }

    try {
        const product = await ProductRepository.findById(id);

        res.status(200).json(product);
    } catch (error) {
        console.error("Erro ao buscar produto: ", error);

        res.status(404).json({
            message: "Produto não encontrado.",
        });
    }
}

async function create(req: Request, res: Response) {
    const message = validate(req.body);

    if (message) {
        return res.status(400).json({ message });
    }

    try {
        const product = await ProductRepository.create(buildProduct(req.body));

        res.status(201).json(product);
    } catch (error: any) {
        console.error("Erro ao criar produto: ", error);

        // 23503 / 22P02: categoria inexistente ou UUID inválido
        if (error?.code === "23503" || error?.code === "22P02") {
            return res.status(400).json({
                message: "A categoria informada em 'category_id' não existe.",
            });
        }

        res.status(500).json({
            message: "Erro ao criar produto.",
        });
    }
}

async function update(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID do Produto não informado."
        });
    }

    const message = validate(req.body);

    if (message) {
        return res.status(400).json({ message });
    }

    try {
        const product = await ProductRepository.update(id, buildProduct(req.body));

        res.status(200).json(product);
    } catch (error: any) {
        console.error("Erro ao atualizar produto: ", error);

        // PGRST116: nenhum registro encontrado
        if (error?.code === "PGRST116") {
            return res.status(404).json({
                message: "Produto não encontrado.",
            });
        }

        // 23503 / 22P02: categoria inexistente ou UUID inválido
        if (error?.code === "23503" || error?.code === "22P02") {
            return res.status(400).json({
                message: "Categoria ou ID informado é inválido.",
            });
        }

        res.status(500).json({
            message: "Erro ao atualizar produto.",
        });
    }
}

async function remove(req: Request<{ id: string }>, res: Response) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "ID do Produto não informado."
        });
    }

    try {
        await ProductRepository.remove(id);

        res.status(200).json({
            message: "Produto removido com sucesso.",
        });
    } catch (error: any) {
        console.error("Erro ao remover produto: ", error);

        // PGRST116: nenhum registro encontrado
        if (error?.code === "PGRST116") {
            return res.status(404).json({
                message: "Produto não encontrado.",
            });
        }

        res.status(500).json({
            message: "Erro ao remover produto.",
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
