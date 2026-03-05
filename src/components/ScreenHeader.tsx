import { Separator } from "./ui/separator";

type ScreenHeaderProps = {
    title: string;
    description: string;
};

const ScreenHeader = ({ title, description }: ScreenHeaderProps) => {
    return (
        <>
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>

            <Separator />
        </>
    );
};

export default ScreenHeader;
