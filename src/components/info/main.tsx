import { DatabaseBTreePage } from "../../type";
import { useInfoContext } from "../info";
import { BPageHeaderInfo } from "./bpage-header";
import { DatabaseHeaderInfo } from "./database-header";

export function InfoSidebar() {
  const { info } = useInfoContext();

  if (info.type === "database-header") {
    return <DatabaseHeaderInfo header={info.database.header} />;
  } else if (info.type === "btree-page-header") {
    return <BPageHeaderInfo page={info.page as DatabaseBTreePage} />;
  }

  return <div>Some Unknown</div>;
}
