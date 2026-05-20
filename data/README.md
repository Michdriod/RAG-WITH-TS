# Medical Data Folder

## How to Use

1. **Place your PDF files here**
   - Add your medical textbook PDF files to this folder
   - Example: `medical-textbook.pdf`, `oncology-guide.pdf`, etc.

2. **Run the upsert script**
   ```bash
   npm run upsert
   ```

3. **What happens:**
   - The script reads all PDF files from this folder
   - Extracts text from each PDF
   - Splits text into chunks (~500 characters each)
   - Creates embeddings using `Xenova/all-MiniLM-L6-v2`
   - Uploads to your Pinecone index: `medicalbot`

## File Format

✅ **Supported:** `.pdf` files  
📁 **Example structure:**
```
data/
├── medical-textbook.pdf
├── oncology-chapter.pdf
└── cardiology-notes.pdf
```

## Important Notes

⚠️ **This will create NEW embeddings** with the current model  
⚠️ **Make sure to delete old data** from Pinecone first if using different embeddings  
✅ **Large PDFs will be chunked automatically** for optimal retrieval
