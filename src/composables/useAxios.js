import { ref, watch } from "vue";
import { axiosInstance } from "@/apis";
import { config } from "@/configs";

const useAxios = () => {
  const response = ref({});
  const error = ref({});
  const loading = ref(false);
  const isSuccess = ref(false);
  const isError = ref(false);
  const controller = ref();

  const axiosFetch = async (configObject) => {
    const { method, url, queryParams = {}, payload = {} } = configObject;

    try {
      loading.value = true;
      const ctrl = new AbortController();
      controller.value = ctrl;

      const res = await axiosInstance(queryParams)[method.toLowerCase()](
        url,
        payload
      );

      response.value = res?.data;
      isSuccess.value = true;
      isError.value = false;
      error.value = {};

      if (config.nodeEnv === "development")
        console.log(`[Response ${method.toUpperCase()}] =>`, res?.data);
    } catch (err) {
      response.value = {};
      isSuccess.value = false;
      isError.value = true;
      error.value = err?.response?.data;

      if (config.nodeEnv === "development")
        console.error(
          `[Error ${method.toUpperCase()}] =>`,
          err?.response?.data
        );
    } finally {
      loading.value = false;
    }
  };

  watch(controller, (val) => {
    if (val) val.abort();
  });

  return {
    axiosFetch,
    loading,
    response,
    isSuccess,
    error,
    isError,
    controller,
  };
};

export default useAxios;
