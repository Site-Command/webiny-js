// @ts-nocheck
import { useCallback } from "react";
import { useApolloClient } from "react-apollo";
import { useRouter } from "@webiny/react-router";
import {
    CREATE_REVISION_FORM,
    DELETE_REVISION
} from "@webiny/app-page-builder/admin/graphql/pages";
import { usePublishRevisionHandler } from "../utils/usePublishRevisionHandler";
import { useSnackbar } from "@webiny/app-admin/hooks/useSnackbar";

export function useRevisionHandlers(props) {
    const { showSnackbar } = useSnackbar();
    const { history } = useRouter();
    const client = useApolloClient();
    const { page } = props;
    const { publishRevision } = usePublishRevisionHandler({ page });

    const createRevision = useCallback(async () => {
        const { data: res } = await client.mutate({
            mutation: CREATE_REVISION_FORM,
            variables: { revision: rev.id },
            refetchQueries: ["PbListPages"],
            awaitRefetchQueries: true
        });
        const { data, error } = res.pageBuilder.revision;

        if (error) {
            return showSnackbar(error.message);
        }

        history.push(`/page-builder/editor/${data.id}`);
    }, [rev]);

    const editRevision = useCallback(() => {
        history.push(`/page-builder/editor/${rev.id}`);
    }, [rev]);

    const deleteRevision = useCallback(async () => {
        const { data: res } = await client.mutate({
            mutation: DELETE_REVISION,
            variables: { id: rev.id },
            refetchQueries: ["PbListPages"],
            awaitRefetchQueries: true
        });
        const { error } = res.pageBuilder.deleteRevision;
        if (error) {
            return showSnackbar(error.message);
        }

        if (rev.id === page.id) {
            history.push("/page-builder/pages");
        }
    }, [rev, page]);

    return {
        publishRevision,
        createRevision,
        editRevision,
        deleteRevision
    };
}
