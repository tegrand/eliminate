import { Avatar } from "./index";

export default function AvatarDemo() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Avatar Component Demo</h1>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Image Avatars</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Avatar src="https://i.pravatar.cc/150?u=1" name="Jane Doe" size="md" />
          <Avatar src="https://i.pravatar.cc/150?u=2" name="John Smith" size="md" />
          <Avatar src="https://i.pravatar.cc/150?u=3" name="Alice Johnson" size="md" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Fallback to Initials</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Avatar name="Sarah Connor" size="md" />
          <Avatar name="Tony Stark" size="md" />
          <Avatar name="Bruce" size="md" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Fallback to Default Icon</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Avatar size="md" />
          <Avatar src="invalid-url.jpg" size="md" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Sizes</h2>
        <div className="flex flex-wrap gap-6 items-end">
          <Avatar name="Extra Small" size="xs" />
          <Avatar name="Small Avatar" size="sm" />
          <Avatar name="Medium Avatar" size="md" />
          <Avatar name="Large Avatar" size="lg" />
          <Avatar name="Extra Large" size="xl" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Shapes</h2>
        <div className="flex flex-wrap gap-6 items-center">
          <Avatar name="Circle Shape" shape="circle" size="lg" />
          <Avatar name="Rounded Shape" shape="rounded" size="lg" />
          <Avatar name="Square Shape" shape="square" size="lg" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Avatar Groups</h2>
        <div className="flex -space-x-4">
          <Avatar src="https://i.pravatar.cc/150?u=4" className="ring-2 ring-white" size="lg" />
          <Avatar src="https://i.pravatar.cc/150?u=5" className="ring-2 ring-white" size="lg" />
          <Avatar name="David Smith" className="ring-2 ring-white" size="lg" />
          <Avatar fallback="+3" className="ring-2 ring-white bg-gray-100" size="lg" />
        </div>
      </section>
    </div>
  );
}
