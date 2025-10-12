import { supabase } from "../../utils/supabaseClient";

export type IHandlePresignedUrl = {
    bucketName: string;
    path: string;
    duration?: number; // optional, default 60
};

export const handlePresignedUrl = async ({
    bucketName,
    path,
    duration = 60,
}: IHandlePresignedUrl) => {
    try {
        const file_id = path.split(bucketName + "/")[1];
        const { data, error } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(file_id, duration);

        if (error) {
            throw error;
        }

        return data?.signedUrl;
    } catch (error) {
        throw error;
    }
};
