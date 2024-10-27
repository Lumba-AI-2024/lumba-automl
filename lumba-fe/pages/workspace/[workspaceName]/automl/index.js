import Seo from "../../../../src/components/Seo";
import * as React from "react";
import { useRouter } from "next/router";
import Breadcrumb from "../../../../src/components/Breadcrumb";
import Button from "../../../../src/components/Button/Button";
import Plus from "../../../../src/components/Icon/Plus";
import AutoMLPage from "../../../../src/components/Tutorial/AutoML/AutoMLPage";

const AutoML = () => {
    const router = useRouter();
    const { workspaceName } = router.query;
    // route to new-project.js

    return (
        <>
        <Seo title={`${workspaceName} - AutoML`} />
        <Breadcrumb links={[{ label: workspaceName }, { label: "AutoML", href: router.asPath }]} active={"AutoML"} />
        <div className="flex flex-col gap-6 my-6">
            <h1 className="text-2xl font-bold mb-4">Automated ML</h1>
          <AutoMLPage />
        </div>
        </>
    );
}

export default AutoML;
