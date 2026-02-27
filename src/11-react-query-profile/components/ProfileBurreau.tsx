import {useState} from 'react'
import {useQuery,useQueryClient,useMutation} from '@tanstack/react-query';
import { fetchProfile,uploadAvatar } from '../api/profileApi';

const ProfileBurreau = () =>{
    const [uploadPercent,setUploadPercent] = useState(0)

    const queryClient = useQueryClient();

    const {data,isLoading,isError,error} = useQuery({
        queryKey:['profile'],
        queryFn:fetchProfile
    })

    const uploadMutation = useMutation({
        mutationFn:(file:File) => uploadAvatar(file,(percent) => setUploadPercent(percent)),

        onSuccess:() =>{
            queryClient.invalidateQueries({queryKey:['profile']})

            setUploadPercent(0);
        }
    })
    

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 原生 JS 知识点：获取选中的第一个文件
        const file = e.target.files?.[0];
        if (file) {
            // 扣动扳机！把文件扔给 Mutation 去上传
            uploadMutation.mutate(file);
        }
    };

    // --- 防御性 UI 渲染 ---
    if (isLoading) return <div>🗄️ 正在翻阅档案局资料...</div>;
    if (isError) return <div style={{color: 'red'}}>❌ 档案读取失败: {error.message}</div>;

    // --- 正常渲染 ---
    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', width: '300px' }}>
            <h2>{data?.name} 的专属档案</h2>
            
            {/* 头像展示区 */}
            <div style={{ marginBottom: '20px' }}>
                <img 
                    src={data?.avatarUrl || 'https://via.placeholder.com/100'} 
                    alt="avatar" 
                    style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
            </div>

            {/* 上传控制区 */}
            <div>
                {uploadMutation.isPending ? (
                    // 如果正在上传，隐藏选择框，显示进度条！
                    <div style={{ color: 'blue', fontWeight: 'bold' }}>
                        🚀 旗帜织造中... {uploadPercent}%
                    </div>
                ) : (
                    // 如果没在上传，显示原生的文件选择框
                    <input 
                        type="file" 
                        accept="image/*" // 限制只能选图片
                        onChange={handleFileSelect} 
                    />
                )}
            </div>
            
            {/* 兜底报错：如果上传本身失败了，也要给个提示 */}
            {uploadMutation.isError && (
                <div style={{ color: 'red', marginTop: '10px' }}>
                    上传失败：{uploadMutation.error?.message}
                </div>
            )}
        </div>
    );
}