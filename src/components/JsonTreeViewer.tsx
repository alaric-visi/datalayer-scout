import { JsonView, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

interface JsonTreeViewerProps {
    data: Record<string, unknown> | unknown;
    shouldExpandNode?: (level: number) => boolean;
}

export const JsonTreeViewer = ({ data, shouldExpandNode }: JsonTreeViewerProps) => {
    // Default: expand first 2 levels
    const defaultShouldExpand = (level: number) => level < 2;

    return (
        <div className="json-tree-viewer">
            <JsonView
                data={data}
                shouldExpandNode={shouldExpandNode || defaultShouldExpand}
                style={{
                    ...defaultStyles,
                    container: 'json-viewer-container',
                    basicChildStyle: 'json-viewer-basic',
                    label: 'json-viewer-label',
                    nullValue: 'json-viewer-null',
                    undefinedValue: 'json-viewer-undefined',
                    numberValue: 'json-viewer-number',
                    stringValue: 'json-viewer-string',
                    booleanValue: 'json-viewer-boolean',
                    otherValue: 'json-viewer-other',
                    punctuation: 'json-viewer-punctuation',
                    collapseIcon: 'json-viewer-collapse-icon',
                    expandIcon: 'json-viewer-expand-icon',
                    collapsedContent: 'json-viewer-collapsed-content',
                }}
            />
        </div>
    );
};
