const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const glob = require('glob');

// Configurações do Supabase
const SUPABASE_URL = "https://baoboggeqhksaxkuudap.supabase.co";
// ATENÇÃO: Esta chave (sbp_...) parece ser um Token de Acesso Pessoal e não a chave de API do projeto (anon/service_role).
// Se falhar o login, verifique se está usando a chave correta (Project API Key).
const SUPABASE_KEY = "sbp_bf907a9ca211f2204d9c53622208006dc5877cc1";

// Caminhos
// Usar raw string para caminho Windows ou escapar backslashes
const OLD_SYSTEM_PATH = String.raw`C:\Users\Yoda\Downloads\DVD PVO 2010\PVO`;
const IMAGES_PATH = OLD_SYSTEM_PATH;

// Cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Mapeamento de categorias
const CATEGORY_MAPPING = {
    "1": { id: 1, name: "Tanques" },
    "2": { id: 2, name: "Veículos Blindados" },
    "3": { id: 3, name: "Artilharia" },
    "4": { id: 4, name: "Aeronaves" },
    "5": { id: 5, name: "Helicópteros" },
    "6": { id: 6, name: "Navios" },
    "7": { id: 7, name: "Mísseis" },
    "8": { id: 8, name: "Outros" },
};

async function migrateCategories() {
    console.log("\n📂 Migrando categorias...");
    let count = 0;

    for (const [catIdStr, catData] of Object.entries(CATEGORY_MAPPING)) {
        try {
            const category = {
                id: catData.id,
                name: catData.name,
                description: `Equipamentos do tipo ${catData.name}`,
                slug: catData.name.toLowerCase().replace(/ /g, "-")
            };

            // Upsert na tabela categories
            const { error } = await supabase.from('categories').upsert(category);

            if (error) throw error;

            console.log(`  ✓ Categoria ${catIdStr}: ${catData.name}`);
            count++;
        } catch (e) {
            console.error(`  ✗ Erro ao migrar categoria ${catIdStr}: ${e.message}`);
        }
    }
    console.log(`✓ Total de ${count} categorias migradas`);
}

async function uploadImage(localPath, storagePath) {
    try {
        const fileContent = fs.readFileSync(localPath);

        const { data, error } = await supabase.storage
            .from('equipment-images')
            .upload(storagePath, fileContent, {
                contentType: 'image/jpeg',
                upsert: true
            });

        if (error) throw error;

        const { data: publicData } = supabase.storage
            .from('equipment-images')
            .getPublicUrl(storagePath);

        return publicData.publicUrl;
    } catch (e) {
        console.error(`✗ Erro no upload de ${storagePath}: ${e.message}`);
        return null;
    }
}

async function migrateImagesFromFolder(folderNumber) {
    const folderPath = path.join(IMAGES_PATH, folderNumber);
    if (!fs.existsSync(folderPath)) {
        console.log(`⚠ Pasta ${folderNumber} não encontrada`);
        return;
    }

    // glob no node pode ser async ou sync. Usando sync.
    const pattern = path.join(folderPath, "*.jpg").replace(/\\/g, '/'); // glob patterns use /
    const images = glob.sync(pattern);

    console.log(`\n📁 Migrando pasta ${folderNumber} (${images.length} imagens)...`);

    let uploadedCount = 0;
    for (const imagePath of images) {
        const filename = path.basename(imagePath);
        const storagePath = `category-${folderNumber}/${filename}`;

        const url = await uploadImage(imagePath, storagePath);

        if (url) {
            uploadedCount++;
            const code = filename.replace('.jpg', '');

            try {
                const equipmentData = {
                    code: code,
                    name: `Equipamento ${code}`,
                    category_id: parseInt(folderNumber),
                    image_path: url,
                    description: `Equipamento militar - Categoria ${CATEGORY_MAPPING[folderNumber].name}`
                };

                const { error } = await supabase.from('equipment').insert(equipmentData);

                // Se der erro de duplicação, podemos ignorar ou tentar upsert?
                // Vamos apenas logar por enquanto
                if (error) {
                    // console.log(`  ⚠ Erro ao inserir no banco: ${error.message}`);
                }
            } catch (e) {
                console.log(`  ⚠ Erro ao inserir no banco: ${e.message}`);
            }
        }
    }
    console.log(`✓ Pasta ${folderNumber}: ${uploadedCount}/${images.length} imagens migradas`);
}

async function createStorageBucket() {
    try {
        const { data, error } = await supabase.storage.createBucket('equipment-images', {
            public: true
        });
        if (error && !error.message.includes('already exists')) {
            console.log(`ℹ Aviso sobre bucket: ${error.message}`);
        } else {
            console.log("✓ Bucket 'equipment-images' criado/verificado");
        }
    } catch (e) {
        // Ignorar
    }
}

async function main() {
    console.log("=".repeat(60));
    console.log("🚀 INICIANDO MIGRAÇÃO - PVO ANTIGO → SUPABASE (Node.js)");
    console.log("=".repeat(60));

    await createStorageBucket();
    await migrateCategories();

    for (const folderNum of Object.keys(CATEGORY_MAPPING)) {
        await migrateImagesFromFolder(folderNum);
        // Pequena pausa para não rate-limit se necessário?
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ MIGRAÇÃO CONCLUÍDA!");
    console.log("=".repeat(60));
}

main().catch(console.error);
