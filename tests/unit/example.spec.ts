import { shallowMount } from "@vue/test-utils";
import VGraph from "@/components/VGraph.vue";

describe("HelloWorld.vue", () => {
  it("renders props.msg when passed", () => {
    const msg = "new message";
    const wrapper = shallowMount(VGraph, {
      props: { msg },
    });
    expect(wrapper.text()).toMatch(msg);
  });
});
