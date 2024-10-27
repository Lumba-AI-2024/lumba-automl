// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const API_ROUTE = process.env.NEXT_PUBLIC_API_ROUTE;

export default function handler(req, res) {
    try {
        console.log(req.query);
        switch (req.method) {
            case "GET":
                const { token } = req.cookies;
                const checkDataset = async () => {
                    const response1 = await fetch(
                        `${API_ROUTE}/preprocess/null/?username=${req.query.username}&workspace=${req.query.workspace}&datasetname=${req.query.filename}&type=${req.query.type}&selected_columns=${req.query.selectedTrainingColumns}`,
                        {
                            headers: {
                                Authorization: `Token ${token}`,
                            },
                        }
                    );
                    const missingData = await response1.json();

                    const response2 = await fetch(
                        `${API_ROUTE}/preprocess/duplication/?username=${req.query.username}&workspace=${req.query.workspace}&datasetname=${req.query.filename}&type=${req.query.type}&selected_columns=${req.query.selectedTrainingColumns}`,
                        {
                            headers: {
                                Authorization: `Token ${token}`,
                            },
                        }
                    );
                    const duplicateData = await response2.json();

                    const encodeQueryParam = (param) => encodeURIComponent(param);

                    const response5 = await fetch(
                        `${API_ROUTE}/preprocess/categorical/?username=${encodeQueryParam(req.query.username)}&workspace=${encodeQueryParam(req.query.workspace)}&datasetname=${encodeQueryParam(req.query.filename)}&type=${encodeQueryParam(req.query.type)}&selected_columns=${encodeQueryParam(req.query.selectedTrainingColumns)}`,
                        {
                            headers: {
                                Authorization: `Token ${token}`,
                            },
                            method: 'GET'
                        }
                    );
                    const categoricalData = await response5.json();


                    return { missingData, duplicateData, categoricalData };
                };
                checkDataset().then((data) => res.status(200).json(data));
                break;
            default:
                res.status(200).json({ name: "Jon Doe" });
        }
    } catch (err) {
        res.json(err);
        res.status(405).end();
    }
}
