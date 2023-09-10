import { useAxios } from "@/composables";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

describe("useAxios", () => {
  let axiosMock;
  const successMessage = "Success";
  const errorMessage = "Internal Server Error";
  const successUrl = "/api/data";
  const errorUrl = "/api/error";
  const method = "GET";

  beforeAll(() => {
    axiosMock = new MockAdapter(axios);
    axiosMock.onGet(successUrl).reply(200, { message: successMessage });
    axiosMock.onGet(errorUrl).reply(500, { message: errorMessage });
  });

  it("loading should be false before fetching", () => {
    const { loading } = useAxios();
    expect(loading.value).toEqual(false);
  });

  it("loading should be true while fetching", () => {
    const { axiosFetch, loading } = useAxios();
    axiosFetch({ method, url: successUrl });
    expect(loading.value).toEqual(true);
  });

  it("loading should be false after fetching", async () => {
    const { axiosFetch, loading } = useAxios();
    await axiosFetch({ method, url: successUrl });
    expect(loading.value).toEqual(false);
  });

  it("if success should has response and isSuccess should be true", async () => {
    const { axiosFetch, isSuccess, isError, response, error, controller } =
      useAxios();
    await axiosFetch({ method, url: successUrl });

    expect(isSuccess.value).toEqual(true);
    expect(response.value).toEqual({ message: successMessage });
    expect(isError.value).toEqual(false);
    expect(error.value).toEqual({});
    expect(controller.value.signal.aborted).toBe(true);
  });

  it("if error should has error and isError should be true", async () => {
    const { axiosFetch, isSuccess, isError, response, error, controller } =
      useAxios();
    await axiosFetch({ method, url: errorUrl });

    expect(isError.value).toEqual(true);
    expect(error.value).toEqual({ message: errorMessage });
    expect(isSuccess.value).toEqual(false);
    expect(response.value).toEqual({});
    expect(controller.value.signal.aborted).toBe(true);
  });
});
