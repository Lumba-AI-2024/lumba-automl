// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";

const API_ROUTE = process.env.NEXT_PUBLIC_API_ROUTE;

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "GET":
        break;
      case "POST":
        const {
          filename,
          missing,
          columnsMissing,
          duplication,
          columnsDuplication,
          outlier,
          convert,
          columnsConvert,
          targetTypeConvert,
          workspace,
          username,
          normalize,
          methodNormalize,
          columnsNormalize,
          oversampling,
          columnsOversampling,
        } = req.body;
        const { token } = req.cookies;

        const formData = new FormData();
        formData.append("username", username);
        formData.append("workspace", workspace);
        formData.append("datasetname", filename);
        formData.append("missing", missing);
        formData.append("duplication", duplication);
        formData.append("outlier", outlier);
        formData.append("normalize", normalize);
        formData.append("convert", convert);
        formData.append("oversampling", oversampling);
        formData.append("columns_missing", columnsMissing ?? "");
        formData.append("columns_duplication", columnsDuplication ?? "");
        formData.append("columns_convert", columnsConvert ?? "");
        formData.append("columns_normalize", columnsNormalize ?? "");
        formData.append("columns_oversampling", columnsOversampling ?? "");
        formData.append("target_type_convert", targetTypeConvert ?? "");
        formData.append("method_normalize", methodNormalize);

        try {
          const { data } = await axios.post(`${API_ROUTE}/preprocess/handle/`, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Token ${token}`,
            },
            data: formData,
          });

          res.status(200).json(data);
        } catch (err) {
          res.status(400).json(err);
        }

        break;
      default:
        res.status(200).json({ name: "Jon Doe" });
    }
  } catch (err) {
    res.json(err);
    res.status(405).end();
  }
}
